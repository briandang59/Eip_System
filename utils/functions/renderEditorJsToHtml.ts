import EditorJsToHtml from 'editorjs-html';
import { OutputData } from '@editorjs/editorjs';

const edjsParser = EditorJsToHtml();

export function renderEditorJsToHtml(data: OutputData): { __html: string } {
    const html = edjsParser.parse(data);
    return { __html: html };
}

// Helper function to safely extract text from complex data structures
function extractTextFromData(data: any): string {
    if (typeof data === 'string') {
        return data;
    }
    if (typeof data === 'number') {
        return data.toString();
    }
    if (typeof data === 'object' && data !== null) {
        // Handle EditorJS text objects
        if (data.text) {
            return data.text;
        }
        // Handle objects with content property
        if (data.content) {
            return extractTextFromData(data.content);
        }
        // Handle arrays
        if (Array.isArray(data)) {
            return data.map((item) => extractTextFromData(item)).join(' ');
        }
        // Handle objects with multiple properties
        if (typeof data === 'object') {
            const textParts = [];
            for (const key in data) {
                if (data.hasOwnProperty(key) && typeof data[key] !== 'object') {
                    textParts.push(data[key]);
                }
            }
            return textParts.join(' ');
        }
    }
    return JSON.stringify(data);
}

// Enhanced function to render EditorJS content with proper styling for different block types
export function renderEditorJsContent(data: OutputData): { __html: string } {
    if (!data || !data.blocks || data.blocks.length === 0) {
        return { __html: '' };
    }

    const htmlContent = data.blocks
        .map((block) => {
            switch (block.type) {
                case 'paragraph':
                    const paragraphText = extractTextFromData(block.data.text);
                    return `<p class="editor-paragraph mb-4 leading-relaxed text-gray-800">${paragraphText}</p>`;

                case 'header':
                    const level = (block.data.level || 1) as 1 | 2 | 3 | 4 | 5 | 6;
                    const headerClass = `editor-header-${level} font-bold text-gray-900 mb-4`;
                    const headerSize =
                        {
                            1: 'text-3xl',
                            2: 'text-2xl',
                            3: 'text-xl',
                            4: 'text-lg',
                            5: 'text-base',
                            6: 'text-sm',
                        }[level] || 'text-2xl';
                    const headerText = extractTextFromData(block.data.text);

                    return `<h${level} class="${headerClass} ${headerSize}">${headerText}</h${level}>`;

                case 'list':
                    const listType = block.data.style === 'ordered' ? 'ol' : 'ul';
                    const listClass =
                        block.data.style === 'ordered'
                            ? 'editor-list-ordered list-decimal ml-6 mb-4 space-y-2'
                            : 'editor-list-unordered list-disc ml-6 mb-4 space-y-2';

                    const listItems = block.data.items
                        .map((item: any) => {
                            const itemText = extractTextFromData(item);
                            return `<li class="text-gray-800 leading-relaxed">${itemText}</li>`;
                        })
                        .join('');

                    return `<${listType} class="${listClass}">${listItems}</${listType}>`;

                case 'quote':
                    const quoteText = extractTextFromData(block.data.text);
                    const quoteCaption = block.data.caption
                        ? extractTextFromData(block.data.caption)
                        : '';

                    return `
                    <blockquote class="editor-quote border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50">
                        <p class="text-gray-700 italic font-medium">${quoteText}</p>
                        ${quoteCaption ? `<cite class="text-sm text-gray-500 mt-2 block">— ${quoteCaption}</cite>` : ''}
                    </blockquote>
                `;

                case 'delimiter':
                    return `<hr class="editor-delimiter my-8 border-gray-300" />`;

                case 'checklist':
                    const checklistItems = block.data.items
                        .map((item: any) => {
                            const itemText = extractTextFromData(item.text || item);
                            const isChecked = item.checked || false;

                            return `<li class="flex items-center space-x-2 mb-2">
                        <input type="checkbox" ${isChecked ? 'checked' : ''} disabled class="editor-checklist-item" />
                        <span class="text-gray-800 ${isChecked ? 'line-through text-gray-500' : ''}">${itemText}</span>
                    </li>`;
                        })
                        .join('');

                    return `<ul class="editor-checklist mb-4 space-y-2">${checklistItems}</ul>`;

                case 'image':
                    const imageUrl = block.data.file?.url || block.data.url || '';
                    const imageCaption = block.data.caption
                        ? extractTextFromData(block.data.caption)
                        : '';

                    return `
                    <figure class="editor-image my-6">
                        <img src="${imageUrl}" alt="${imageCaption}" class="max-w-full h-auto rounded-lg shadow-md" />
                        ${imageCaption ? `<figcaption class="text-center text-sm text-gray-600 mt-2">${imageCaption}</figcaption>` : ''}
                    </figure>
                `;

                default:
                    // For unknown block types, try to extract meaningful text
                    const unknownText = extractTextFromData(block.data);
                    return `<p class="editor-unknown-block mb-4 text-gray-600">${unknownText}</p>`;
            }
        })
        .join('');

    return { __html: htmlContent };
}

// Function to get block type for debugging or conditional rendering
export function getBlockType(block: any): string {
    return block.type || 'unknown';
}

// Function to check if content has specific block types
export function hasBlockType(data: OutputData, blockType: string): boolean {
    return data.blocks?.some((block) => block.type === blockType) || false;
}

// Function to debug block data structure
export function debugBlockData(block: any): string {
    return JSON.stringify(block.data, null, 2);
}

// Function to get all block types in the content
export function getAllBlockTypes(data: OutputData): string[] {
    if (!data.blocks) return [];
    return [...new Set(data.blocks.map((block) => block.type))];
}

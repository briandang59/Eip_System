import EditorJsToHtml from 'editorjs-html';
import { OutputData } from '@editorjs/editorjs';

const edjsParser = EditorJsToHtml();

export function renderEditorJsToHtml(data: OutputData): { __html: string } {
    const html = edjsParser.parse(data);
    return { __html: html };
}

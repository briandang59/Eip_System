import EditorJsToHtml from 'editorjs-html';
import { OutputData } from '@editorjs/editorjs';

const edjsParser = EditorJsToHtml();

export function renderEditorJsToHtml(data: OutputData): string {
    return edjsParser.parse(data);
}

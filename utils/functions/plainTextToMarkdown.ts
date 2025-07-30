export function plainTextToMarkdown(text: string): string {
    const lines = text.split(/\r?\n/);
    const result: string[] = [];
    let inList = false;
    let isOrderedList = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Bỏ qua nhiều dòng trắng liên tiếp
        if (line === '') {
            if (result[result.length - 1] !== '') {
                result.push('');
            }
            inList = false;
            isOrderedList = false;
            continue;
        }

        // Tiêu đề: dòng đầu hoặc dòng in hoa
        if (
            i === 0 ||
            (line === line.toUpperCase() && /^[A-ZÀ-Ỵ0-9\s]+$/.test(line) && line.length <= 100)
        ) {
            result.push(`## ${line}`);
            result.push('');
            continue;
        }

        // Unordered list: bắt đầu bằng - hoặc *
        if (/^[-*]\s+/.test(line)) {
            result.push(line);
            inList = true;
            continue;
        }

        // Ordered list: 1. 2. 3.
        if (/^\d+\.\s+/.test(line)) {
            result.push(line);
            isOrderedList = true;
            continue;
        }

        // Nếu đang trong list, kết thúc đoạn trước đó
        if (inList || isOrderedList) {
            result.push('');
            inList = false;
            isOrderedList = false;
        }

        // Mặc định là đoạn văn
        result.push(line);
    }

    // Xóa dòng trắng đầu/cuối nếu có
    while (result[0] === '') result.shift();
    while (result[result.length - 1] === '') result.pop();

    return result.join('\n');
}

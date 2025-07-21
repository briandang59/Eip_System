export type CreateBookingRequest = {
    meeting: {
        topic: string;
        content: string;
        date_book: string;
        applicant: string;
        participants: string;
        application_dept: string;
        note: string;
        meeting_type_id: number;
        account_id: number;
    };
    book_meeting: {
        start: string;
        end: string;
    };
    meeting_rooms: number[];
};

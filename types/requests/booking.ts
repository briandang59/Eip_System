export type CreateBookingRequest = {
    meeting: {
        id?: number;
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
        id?: number;
    };
    meeting_rooms: number[];
};

export type DeleteBookingRequest = {
    active: boolean;
    id: number;
};

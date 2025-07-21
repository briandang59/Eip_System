export type MeetingRoomResponseType = {
    id: number;
    active: boolean;
    work_place_id: number;
    created_at: string;
    name_en: string;
    name_zh: string;
    name_vn: string;
    note: string | null;
};

export type MeetingTypeResponseType = {
    id: number;
    created_at: string;
    name_en: string;
    name_zh: string;
    name_vn: string;
    active: boolean;
};

export type MeetingBookingDetailResponseType = {
    id: number;
    account_id: number;
    meeting_type_id: number;
    created_at: string;
    topic: string;
    update_at: string;
    content: string;
    date_book: string;
    application_dept: string;
    applicant: string;
    participants: string;
    note: string;
    active: boolean;
    book_meeting: BookingMeeting[];
};

interface BookingMeeting {
    id: number;
    end: string;
    start: string;
    update_at: string;
    created_at: string;
    meeting_id: number;
    book_meeting_room: {
        id: number;
        created_at: string;
        book_meeting_id: number;
        meeting_room_id: number;
    }[];
}

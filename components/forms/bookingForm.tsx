import { MeetingRoomResponseType, MeetingTypeResponseType } from '@/types/response/meeting';
import { WorkPlaceType } from '@/types/response/roles';
import { getLocalizedName } from '@/utils/functions/getLocalizedName';
import { useTranslationCustom } from '@/utils/hooks/useTranslationCustom';
import {
    Button,
    Checkbox,
    CheckboxProps,
    DatePicker,
    DatePickerProps,
    Form,
    GetProps,
    Radio,
} from 'antd';
import { useMemo, useState } from 'react';
import { FormInput, FormTextArea } from '../formsComponent';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { toast } from 'sonner';
import { CreateBookingRequest } from '@/types/requests/booking';
import { bookingService } from '@/apis/services/booking';
import { getInfomation } from '@/utils/functions/getInfomation';
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const { RangePicker } = DatePicker;
type MergedRoomType = MeetingRoomResponseType & {
    factory: string;
};
interface BookingForm {
    meetingRooms: MeetingRoomResponseType[];
    meetingTypes: MeetingTypeResponseType[];
    workplaces: WorkPlaceType[];
    close: () => void;
}

const schema = yup
    .object({
        topic: yup.string().required(),
        content: yup.string().required(),
        application_department: yup.string().required(),
        applicant: yup.string().required(),
        participant: yup.string().required(),
        note: yup.string().required(),
    })
    .required();

type FormData = yup.InferType<typeof schema>;
function BookingForm({ meetingRooms, meetingTypes, workplaces, close }: BookingForm) {
    const { t, lang } = useTranslationCustom();
    const [selectedType, setSelectedType] = useState<number>();
    const [selectedMeetingRoom, setSelectedMeetingRoom] = useState<number[]>([]);
    const [selectedDate, setSelectedDate] = useState<{ start: string; end: string }>({
        start: '',
        end: '',
    });
    const myInfo = getInfomation();
    const mergedAndGroupedRooms = useMemo(() => {
        const workplaceMap = new Map();
        workplaces.forEach((wp) => {
            workplaceMap.set(wp.id, wp.name_en);
        });

        const groupedObject = meetingRooms.reduce(
            (acc: Record<string, MergedRoomType[]>, currentRoom) => {
                const factory = workplaceMap.get(currentRoom.work_place_id) || 'N/A';

                if (!acc[factory]) {
                    acc[factory] = [];
                }

                acc[factory].push({ ...currentRoom, factory });

                return acc;
            },
            {} as Record<string, MergedRoomType[]>,
        );

        return Object.keys(groupedObject).map((factoryName) => ({
            factory: factoryName,
            rooms: groupedObject[factoryName],
        }));
    }, [meetingRooms, workplaces]);

    const handleToggleMeetingRoom = (id: number) => {
        const isExists = selectedMeetingRoom.some((roomId) => roomId === id);

        if (isExists) {
            const newArray = selectedMeetingRoom.filter((roomId) => roomId !== id);
            setSelectedMeetingRoom(newArray);
        } else {
            setSelectedMeetingRoom([...selectedMeetingRoom, id]);
        }
    };
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            if (!selectedType || !myInfo) {
                toast.error(
                    'Vui lòng chọn loại cuộc họp và đảm bảo thông tin cá nhân đã được tải.',
                );
                return;
            }
            const newData: CreateBookingRequest = {
                book_meeting: {
                    start: selectedDate.start,
                    end: selectedDate.end,
                },
                meeting: {
                    topic: data.topic,
                    content: data.content,
                    date_book: selectedDate.start.split(' ')[0],
                    applicant: data.applicant,
                    participants: data.participant,
                    application_dept: data.application_department,
                    note: data.note,
                    meeting_type_id: selectedType,
                    account_id: myInfo.account_id,
                },
                meeting_rooms: selectedMeetingRoom,
            };
            console.log('newData', newData);
            await bookingService.add(newData);
            toast.success('successed');
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
        console.log('onOk: ', value);
    };
    const onChange: CheckboxProps['onChange'] = (e) => {
        handleToggleMeetingRoom(e.target.value);
    };
    return (
        <div className="min-h-[500px] grid grid-cols-12">
            <div className="col-span-8 border-r border-r-gray-300 flex flex-col gap-4 p-2">
                <span className="text-[14px] font-medium text-gray-500">
                    {t.meeting_form.meeting_type}
                </span>
                <Radio.Group
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="grid grid-cols-3 gap-y-4"
                >
                    {meetingTypes.map((item) => (
                        <Radio key={item.id} value={item.id} className="flex items-center">
                            {getLocalizedName(item?.name_en, item?.name_zh, item?.name_vn, lang)}
                        </Radio>
                    ))}
                </Radio.Group>
                <span className="text-[14px] font-medium text-gray-500">{t.meeting_form.date}</span>
                <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    onChange={(_value, dateString) => {
                        setSelectedDate({
                            start: dateString[0],
                            end: dateString[1],
                        });
                    }}
                    onOk={onOk}
                />
                <div className="flex flex-col gap-2">
                    {mergedAndGroupedRooms.map((item) => (
                        <>
                            <span className="text-[14px] font-medium text-gray-500">
                                {item.factory}
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                                {item.rooms.map((room) => (
                                    <Checkbox onChange={onChange} value={room.id} key={room.id}>
                                        {getLocalizedName(
                                            room?.name_en,
                                            room?.name_zh,
                                            room?.name_vn,
                                            lang,
                                        )}
                                    </Checkbox>
                                ))}
                            </div>
                        </>
                    ))}
                </div>
            </div>

            <div className="col-span-4 p-2">
                <Form
                    layout="vertical"
                    className="w-full flex flex-col gap-2"
                    onFinish={handleSubmit(onSubmit)}
                >
                    <FormInput
                        control={control}
                        name="topic"
                        label={t.meeting_form.topic}
                        placeholder="Enter topic"
                        size="large"
                        required
                        error={errors.topic?.message}
                    />

                    <FormTextArea
                        control={control}
                        name="content"
                        label={t.meeting_form.content}
                        placeholder="Enter content"
                        size="large"
                        required
                    />
                    <FormInput
                        control={control}
                        name="application_department"
                        label={t.meeting_form.department}
                        placeholder="Enter department"
                        size="large"
                        error={errors.application_department?.message}
                        required
                    />

                    <FormInput
                        control={control}
                        name="applicant"
                        label={t.meeting_form.person}
                        placeholder="Enter person"
                        size="large"
                        error={errors.applicant?.message}
                        required
                    />
                    <FormTextArea
                        control={control}
                        name="participant"
                        label={t.meeting_form.joins}
                        placeholder="Enter participants"
                        size="large"
                        required
                    />
                    <FormTextArea
                        control={control}
                        name="note"
                        label={t.meeting_form.note}
                        placeholder="Enter memo"
                        size="large"
                        required
                    />

                    <div className="col-span-2 flex items-center justify-end">
                        <Form.Item>
                            <div className="flex items-center gap-2">
                                <Button htmlType="button" onClick={close}>
                                    {t.resign_form.cancel}
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    {t.resign_form.submit}
                                </Button>
                            </div>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default BookingForm;

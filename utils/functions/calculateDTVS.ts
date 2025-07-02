import dayjs from 'dayjs';

const punish_level_1 = 20000;
const punish_level_2 = 50000;
const half_day_time = 4;
const full_day_time = 8;

const calculatePunishment = (value: number) => {
    let money = 0;
    let kp = 0;

    if (value > 0) {
        if (value > 0 && value <= 10) {
            money += punish_level_1;
        } else if (value > 10 && value <= 30) {
            money += punish_level_2;
        } else if (value > 30 && value <= 240) {
            kp += half_day_time;
        } else if (value > 240) {
            kp += full_day_time;
        }
    }

    return { money, kp };
};

export const calculateDTVS = (DT: number, VS: number, KP: number, date: string) => {
    const inputDate = dayjs(date);
    const currentDate = dayjs().subtract(1, 'day');

    if (inputDate.isAfter(currentDate, 'day')) {
        return { money_DT: 0, money_VS: 0, kp_time: 0 };
    }

    if (inputDate.day() === 0) {
        return { money_DT: 0, money_VS: 0, kp_time: 0 };
    }

    let kp_time = KP > 0 ? KP : 0;

    const { money: money_DT, kp: kp_DT } = calculatePunishment(DT);
    const { money: money_VS, kp: kp_VS } = calculatePunishment(VS);

    kp_time += kp_DT + kp_VS;

    return {
        money_DT,
        money_VS,
        kp_time,
    };
};

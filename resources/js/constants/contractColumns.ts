import {Column} from "../classes/Column";
import api from "../http";

const noChange = true;
const fullWidth = true;

const getContractStatuses = async () => {
    const {data} = await api.get('contracts/get-statuses');
    return data;
}

export const contractColumns =
    [
        new Column('Должник', 'debtorName', 'ref', {ref: '/debtors', refColName: 'debtorId', style: 'fullString'}),
        new Column('Действующий кредитор', 'creditor', 'setter', {style: 'fullString'}),
        new Column('Первоначальный кредитор', 'firstCreditor', undefined, {noChange, style: 'fullString'}),
        new Column('Договор цессии', 'cession', undefined, {noChange, style: 'fullString'}),
        new Column('Статус', "status", 'selected', {func: getContractStatuses}),
        new Column('Номер договора', "number"), new Column('дата выдачи', 'date_issue', 'date'),
        new Column("сумма выдачи", 'sum_issue', 'money'),
        new Column('дата исполнения', 'due_date', 'date'),
        new Column('Количество дней просрочки', 'delayDays', undefined, {noChange}),
        new Column('Осн. долг на сегодня', 'mainToday', 'money'),
        new Column('процентная ставка(год.)', 'percent', 'percent'),
        new Column('проценты на сегодня', 'percentToday', 'money', {noChange}),
        new Column('неустойка(год.)', 'penalty', 'percent' ),
        new Column('неустойка на сегодня', 'penaltyToday', 'money', {noChange}),
        new Column('Количество платежей', 'paymentsCount', 'text', {noChange}),
        new Column('Дата создания договора', 'createdAt', 'date', {noChange}),
        new Column('Исполнительный документ', 'executiveDocName', 'setter')
    ];

export const creditContractColumns =
    [
            new Column('Должник', 'debtorName', 'ref', {ref: '/debtors', refColName: 'debtorId', style: 'fullString'}),
            new Column('Действующий кредитор', 'creditor', 'setter', {style: 'fullString'}),
            new Column('Первоначальный кредитор', 'firstCreditor', undefined, {noChange, style: 'fullString'}),
            new Column('Договор цессии', 'cession', undefined, {noChange, style: 'fullString'}),
            new Column('Статус', "status", 'selected', {func: getContractStatuses}),
            new Column('Номер договора', "number"),
            new Column('дата выдачи', 'date_issue', 'date'),
            new Column("сумма выдачи", 'sum_issue', 'money'),
            new Column('Дата ежемес. платежа', 'month_due_date'),
            new Column('Сумма ежемес. платежа', 'month_due_sum', 'money'),
            new Column('дата исполнения', 'due_date', 'date'),
            new Column('Количество дней просрочки', 'delayDays', undefined, {noChange}),
            new Column('Осн. долг на сегодня', 'mainToday', 'money'),
            new Column('процентная ставка(год.)', 'percent', 'percent'),
            new Column('проценты на сегодня', 'percentToday', 'money', {noChange}),
            new Column('неустойка(год.)', 'penalty', 'percent' ),
            new Column('неустойка на сегодня', 'penaltyToday', 'money', {noChange}),
            new Column('Количество платежей', 'paymentsCount', 'text', {noChange}),
            new Column('Дата создания договора', 'createdAt', 'date', {noChange}),
            new Column('Исполнительный документ', 'executiveDocName', 'setter')
    ];
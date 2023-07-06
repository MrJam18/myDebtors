import {Column} from "../classes/Column";
import api from "../http";

const noChange = true;

const getContractStatuses = async () => {
    const {data} = await api.get('contracts/get-statuses');
    return data;
}

export const contractColumns =
    [
        new Column('Должник', 'debtorName', 'setter'),
        new Column('Статус', "status", 'selected', {func: getContractStatuses}),
        new Column('Кредитор', 'creditor', 'setter', ),
        new Column('Цессия', 'cession', undefined, {noChange}),
        new Column('Номер договора', "number"),
        new Column('дата выдачи', 'date_issue', 'date'),
        new Column("сумма выдачи", 'sum_issue', 'money'),
        new Column('дата исполнения', 'due_date', 'date'),
        new Column('Количество дней просрочки', 'delayDays', undefined, {noChange}),
        new Column('Осн. долг на сегодня', 'mainToday', 'money'),
        new Column('процентная ставка(год.)', 'percent', 'percent'),
        new Column('проценты на сегодня', 'percentToday', 'money', {noChange}),
        new Column('неустойка(год.)', 'penalty', 'percent' ),
        new Column('неустойка на сегодня', 'penaltyToday', 'money', {noChange}),
        new Column('Cудебный иск', 'courtClaimName', 'setter', {style: 'fullString'}),
        new Column('Исполнительный документ', 'executiveDocName', 'setter', {style: 'fullString'}),
    ];

export const creditContractColumns =
    [
        new Column('Должник', 'debtorName', 'setter'),
        new Column('Статус', "status", 'selected', {func: getContractStatuses}),
        new Column('Кредитор', 'creditor', 'setter', ),
        new Column('Цессия', 'cession', undefined, {noChange}),
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
        new Column('Cудебный иск', 'courtClaimName', 'setter'),
        new Column('Исполнительный документ', 'executiveDocName', 'setter'),

    ];

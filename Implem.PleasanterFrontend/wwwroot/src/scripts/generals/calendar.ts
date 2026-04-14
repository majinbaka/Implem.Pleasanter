import type {
    DateSelectArg,
    EventChangeArg,
    EventClickArg,
    EventMountArg,
    EventSourceFuncArg,
    EventInput
} from '@fullcalendar/core';

interface CalendarItem {
    Id: number;
    SiteId: number;
    Title: string;
    From: string;
    To?: string;
    Changed?: boolean;
    Time?: string;
    StatusHtml?: string;
    DateFormat?: string;
}

interface CalendarEventJsonItem {
    id: number;
    title: string;
    start: string;
    end: string;
    StatusHtml?: string;
    siteId: number;
    DateFormat: string;
}

const newRecord = (calendarSuffix: string) => {
    return (info: DateSelectArg) => {
        const endDate = new Date(info.end);
        if ($(`#CalendarEditorFormat${calendarSuffix}`).val() === 'Ymd' && endDateFormat(endDate)) {
            endDate.setDate(endDate.getDate() - 1);
        }
        const form = document.createElement('form');
        form.setAttribute(
            'action',
            `${String($('#ApplicationPath').val())}items/${String($(`#CalendarSiteData${calendarSuffix}`).val())}/new`
        );
        form.setAttribute('method', 'post');
        form.style.display = 'none';
        document.body.appendChild(form);
        const start = document.createElement('input');
        start.setAttribute('type', 'hidden');
        start.setAttribute('name', `PostInit_${$(`#CalendarReferenceType${calendarSuffix}`).val()}_StartTime`);
        start.setAttribute('value', info.start.toLocaleString());
        form.appendChild(start);
        const end = document.createElement('input');
        end.setAttribute('type', 'hidden');
        end.setAttribute('name', `PostInit_${$(`#CalendarReferenceType${calendarSuffix}`).val()}_CompletionTime`);
        end.setAttribute('value', endDate.toLocaleString());
        form.appendChild(end);
        const fromTo = String($(`#CalendarFromTo${calendarSuffix}`).val()).split('-');
        const match = /^Date/;
        if (fromTo[1]) {
            /* */
        } else if (match.test(fromTo[0])) {
            const from = document.createElement('input');
            from.setAttribute('type', 'hidden');
            from.setAttribute('name', `PostInit_${$(`#CalendarReferenceType${calendarSuffix}`).val()}_${fromTo[0]}`);
            from.setAttribute('value', info.start.toLocaleString());
            form.appendChild(from);
        } else {
            return;
        }
        if ($('#Token').length) {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', 'Token');
            input.setAttribute('value', String($('#Token').val()));
            form.appendChild(input);
        }
        form.submit();
    };
};

const endDateFormat = (endDate: Date) => {
    return endDate.getHours() === 0 && endDate.getMinutes() === 0 && endDate.getSeconds() === 0;
};
const updateRecord = (calendarSuffix: string) => {
    return (info: EventChangeArg) => {
        $p.clearData();
        const data = $p.getData($('.main-form'));
        const fromTo = String($(`#CalendarFromTo${calendarSuffix}`).val()).split('-');
        const prefix = `${$(`#CalendarReferenceType${calendarSuffix}`).val()}_`;
        if (calendarSuffix !== '') {
            $p.set($(`#CalendarSuffix${calendarSuffix}`), String($(`#CalendarSuffix${calendarSuffix}`).val()));
            data.SiteId = info.event.extendedProps.siteId;
            data.Id = $('#Id').val();
            data['EventId'] = info.event.id;
            $p.set($(`#CalendarStart${calendarSuffix}`), String($(`#CalendarStart${calendarSuffix}`).val()));
            $p.set($(`#CalendarEnd${calendarSuffix}`), String($(`#CalendarEnd${calendarSuffix}`).val()));
            $p.set($(`#CalendarViewType${calendarSuffix}`), String($(`#CalendarViewType${calendarSuffix}`).val()));
        } else {
            data.Id = info.event.id;
        }
        data[prefix + fromTo[0]] = info.event.start!.toLocaleString();
        if (info.event.end === null) {
            data[prefix + fromTo[1]] = info.event.start!.toLocaleString();
        } else {
            const endDate = new Date(info.event.end);
            if ($(`#CalendarEditorFormat${calendarSuffix}`).val() === 'Ymd') {
                endDate.setDate(endDate.getDate() - 1);
            }
            data[prefix + fromTo[1]] = endDate.toLocaleString();
        }
        $p.saveScroll();
        $p.send($(`#FullCalendarBody${calendarSuffix}`));
    };
};
const getEventsData = (calendarSuffix: string) => {
    return (
        info: EventSourceFuncArg,
        successCallback: (events: EventInput[]) => void,
        _failureCallback: (error: Error) => void
    ) => {
        if (
            $(`#IsInit${calendarSuffix}`).val() !== 'True' &&
            !(
                info.start.getTime() === Date.parse(String($(`#CalendarStart${calendarSuffix}`).val())) &&
                info.end.getTime() === Date.parse(String($(`#CalendarEnd${calendarSuffix}`).val()))
            )
        ) {
            $p.clearData();
            $p.set($(`#CalendarStart${calendarSuffix}`), info.start.toLocaleDateString());
            $p.set($(`#CalendarEnd${calendarSuffix}`), info.end.toLocaleDateString());
            $(`#FullCalendarBody${calendarSuffix}`).attr('data-action', 'calendar');
            if (calendarSuffix !== '') {
                $p.set($(`#CalendarSuffix${calendarSuffix}`), String($(`#CalendarSuffix${calendarSuffix}`).val()));
            }

            const calendarDiff = Math.round((info.end.getTime() - info.start.getTime()) / (1000 * 60 * 60 * 24));
            if (calendarDiff === 1) {
                $p.set($(`#CalendarViewType${calendarSuffix}`), 'timeGridDay');
            } else if (calendarDiff === 7) {
                $p.set($(`#CalendarViewType${calendarSuffix}`), 'timeGridWeek');
            } else if (calendarDiff < 32) {
                $p.set($(`#CalendarViewType${calendarSuffix}`), 'listMonth');
            } else {
                $p.set($(`#CalendarViewType${calendarSuffix}`), 'dayGridMonth');
            }

            const $control = $(`#FullCalendarBody${calendarSuffix}`);
            $p.send($control);
        } else {
            $(`#IsInit${calendarSuffix}`).val('False');
            let calendarJson: { items: CalendarEventJsonItem[] }[];
            try {
                calendarJson = JSON.parse(String($(`#CalendarJson${calendarSuffix}`).val()));
            } catch {
                successCallback([]);
                return;
            }
            if (calendarJson.length !== 0) {
                const eventData = calendarJson[0].items;
                successCallback(
                    eventData.map((item: CalendarEventJsonItem) => {
                        const endDate = new Date(removeTimeZoneSuffix(item.end)!);
                        if ($(`#CalendarEditorFormat${calendarSuffix}`).val() === 'Ymd') {
                            endDate.setDate(endDate.getDate() + 1);
                            endDate.setHours(0, 0, 0, 0);
                        }
                        return {
                            id: String(item.id),
                            title: item.title,
                            start: removeTimeZoneSuffix(item.start),
                            end: endDate,
                            ...(item.StatusHtml && { StatusHtml: item.StatusHtml }),
                            siteId: item.siteId,
                            format: item.DateFormat,
                            tooltipEnd: item.end
                        };
                    })
                );
            } else {
                successCallback([]);
            }
        }
    };
};
const setCalendarGroup = (group: string | undefined, data: CalendarItem[], calendarSuffix: string) => {
    const hash: Record<string, number> = {};
    const beginSelector =
        group === undefined
            ? `#Calendar${calendarSuffix} .container:first`
            : `#Calendar${calendarSuffix} .container[data-value="${$.escapeSelector(group)}"]:first`;
    const endSelector =
        group === undefined
            ? `#Calendar${calendarSuffix} .container:last`
            : `#Calendar${calendarSuffix} .container[data-value="${$.escapeSelector(group)}"]:last`;
    const begin = new Date($(beginSelector).attr('data-id')!);
    const end = new Date($(endSelector).attr('data-id')!);

    switch ($(`#CalendarTimePeriod${calendarSuffix}`).val()) {
        case 'Yearly':
            setYearly(group, data, hash, begin, end, calendarSuffix);
            break;
        case 'Monthly':
        case 'Weekly':
            setMonthly(group, data, hash, begin, end, calendarSuffix);
            break;
    }
};

const setYearly = (
    group: string | undefined,
    data: CalendarItem[],
    hash: Record<string, number>,
    begin: Date,
    end: Date,
    calendarSuffix: string
) => {
    data.forEach((element: CalendarItem) => {
        element.From = removeTimeZoneSuffix(element.From)!;
        element.To = removeTimeZoneSuffix(element.To);
        let current = $p.beginningMonth(new Date(element.From));
        if (current < begin) {
            current = new Date(begin);
        }
        const rank = getRank(hash, $p.shortDateString(current));
        addItem(group, hash, element, current, calendarSuffix, undefined, undefined, 1);
        if (element.To !== undefined) {
            current.setMonth(current.getMonth() + 1);
            let to = new Date(element.To);
            if (to > end) {
                to = end;
            }
            while ($p.shortDate(to) >= $p.shortDate(current)) {
                addItem(group, hash, element, current, calendarSuffix, 1, rank);
                current.setMonth(current.getMonth() + 1);
            }
        }
    });
};

const setMonthly = (
    group: string | undefined,
    data: CalendarItem[],
    hash: Record<string, number>,
    begin: Date,
    end: Date,
    calendarSuffix: string
) => {
    data.forEach((element: CalendarItem) => {
        element.From = removeTimeZoneSuffix(element.From)!;
        element.To = removeTimeZoneSuffix(element.To);
        if (element.To && begin > new Date(element.To)) return;
        let current = new Date(element.From);
        if (current < begin) {
            current = new Date(begin);
        }
        let rank = getRank(hash, $p.shortDateString(current));
        addItem(group, hash, element, current, calendarSuffix);
        if (element.To !== undefined) {
            current.setDate(current.getDate() + 1);
            let to = new Date(element.To);
            if (to > end) {
                to = end;
            }
            while ($p.shortDate(to) >= $p.shortDate(current)) {
                if (current.getDay() === 1) {
                    rank = getRank(hash, $p.shortDateString(current));
                }
                addItem(group, hash, element, current, calendarSuffix, current.getDay() !== 1, rank);
                current.setDate(current.getDate() + 1);
            }
        }
    });
    if ($(`#CalendarCanUpdate${calendarSuffix}`).val() === '1') {
        $(`#Calendar${calendarSuffix} .item`).draggable({
            revert: 'invalid',
            cursorAt: { top: 0, left: 0 },
            start: function () {
                $(this).parent().droppable({
                    disabled: true
                });
            },
            helper: function () {
                return $('<div />').addClass('dragging').append($(this).text());
            }
        });
        $(`#Calendar${calendarSuffix} .container`).droppable({
            hoverClass: 'hover',
            tolerance: 'pointer',
            drop: function (e, ui) {
                $p.clearData();
                const $control = $(ui.draggable);
                const from = new Date($control.attr('data-from')!);
                const target = new Date($(this).attr('data-id')!);
                const data = $p.getData($('.main-form'));
                const fromTo = String($(`#CalendarFromTo${calendarSuffix}`).val()).split('-');
                const prefix = `${String($(`#CalendarReferenceType${calendarSuffix}`).val())}_`;
                const groupByName: string | undefined = (
                    document.querySelector(`#CalendarGroupByColumnName${calendarSuffix}`) as HTMLInputElement | null
                )?.value;
                const groupByValue = (e.target as HTMLElement).dataset.value;
                if (calendarSuffix !== '') {
                    $p.set($(`#CalendarSuffix${calendarSuffix}`), String($(`#CalendarSuffix${calendarSuffix}`).val()));
                    data.SiteId = $control.attr('data-siteid');
                    data.Id = $('#Id').val();
                    data['EventId'] = $control.attr('data-id');
                } else {
                    data.Id = $control.attr('data-id');
                }
                data[`${prefix}${fromTo[0]}`] = mergeTime(target, from);
                const dataTo = $control.attr('data-to');
                if (dataTo) {
                    const diff = $p.dateDiff('d', target, $p.shortDate(from));
                    const to = $p.dateAdd('d', diff, new Date(dataTo));
                    data[`${prefix}${fromTo[1]}`] = mergeTime(to);
                }
                if (groupByName && groupByValue !== undefined) {
                    data[`${prefix}${groupByName}`] = groupByValue;
                }
                $p.saveScroll();
                $p.send($(`#CalendarBody${calendarSuffix}`));
            }
        });
    }
};

const getRank = (hash: Record<string, number>, id: string) => {
    if (hash[id] === undefined) {
        hash[id] = 0;
    }
    return hash[id];
};

const addItem = (
    group: string | undefined,
    hash: Record<string, number>,
    element: CalendarItem,
    current: Date,
    calendarSuffix: string,
    sub?: boolean | number,
    rank: number = 0,
    yearly?: number
) => {
    const id = $p.shortDateString(current);
    const groupSelector = group === undefined ? '' : `[data-value="${$.escapeSelector(group)}"]`;
    const $cell = $(`[id="Calendar${calendarSuffix}"] > div ${groupSelector}[data-id="${id}"] > div`);
    while (getRank(hash, id) < rank) {
        $cell.append($('<div />').addClass('dummy'));
        hash[id]++;
    }
    const item = $('<div />')
        .addClass('item')
        .addClass(element.Changed === true ? 'changed' : '')
        .attr('data-id', element.Id)
        .attr('data-from', element.From)
        .attr('data-siteid', element.SiteId);
    if (element.To !== undefined) {
        item.attr('data-to', element.To);
    }
    if (sub) {
        item.append(
            $('<div />')
                .attr('data-id', element.Id)
                .addClass('connection')
                .addClass(element.Changed === true ? 'changed' : '')
        );
    }
    item.append(
        $('<div />')
            .addClass('title')
            .css('width', () => {
                const width = $cell.parent().width() ?? 0;
                const margin = 16;
                if (sub) {
                    return '';
                } else if (element.To === undefined) {
                    return width - margin;
                } else if (yearly) {
                    let diff = 0;
                    const month = new Date(current);
                    month.setMonth(month.getMonth() + 1);
                    while (month <= new Date(element.To)) {
                        diff++;
                        month.setMonth(month.getMonth() + 1);
                    }
                    return width * (diff + 1) - margin;
                } else {
                    let diff = $p.dateDiff('d', $p.shortDate(new Date(element.To)), $p.shortDate(current));
                    const col = current.getDay() !== 0 ? current.getDay() : 7;
                    if (col + diff > 6) {
                        diff = 7 - col;
                    } else if (diff < 0) {
                        diff = 0;
                    }
                    return width * (diff + 1) - margin;
                }
            })
            .addClass(sub ? 'sub' : '')
            .attr(
                'title',
                `${htmlEncode(element.Title)} -- ${$p.dateTimeFormatString(new Date(element.From), element.DateFormat ?? '')}${element.To !== undefined && element.To !== element.From ? ` - ${$p.dateTimeFormatString(new Date(element.To), element.DateFormat ?? '')}` : ''}`
            )
            .append($('<span />').addClass('material-symbols-sharp edit-icon').text('edit'))
            .append(
                `${element.Time !== undefined ? `${element.Time} ` : ''}${element.StatusHtml ? element.StatusHtml : ''}`
            )
            .append($('<span />').addClass('title-label').text(htmlEncode(element.Title)))
    );
    $cell.append(item);
    hash[id]++;
};
const removeTimeZoneSuffix = (datetimeStr: string | undefined) => {
    if (datetimeStr === undefined) {
        return datetimeStr;
    } else {
        return datetimeStr.replace('Z', '');
    }
};

const mergeTime = (date: Date, dateTime?: Date) => {
    if (dateTime === undefined) dateTime = date;
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
};

const htmlEncode = (str: string) => {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};
$p.moveCalendar = (type: string, calendarSuffix: string | number) => {
    $p.clearData();
    calendarSuffix = Number(calendarSuffix) > 0 ? `_${calendarSuffix}` : calendarSuffix;
    const $control = $(`#CalendarDate${calendarSuffix}`);
    $control.val(String($(`#Calendar${type}${calendarSuffix}`).val()));
    if (calendarSuffix !== '') {
        $(`#CalendarDate${calendarSuffix}`).attr('data-action', 'calendar');
        $p.set($(`#CalendarSuffix${calendarSuffix}`), String($(`#CalendarSuffix${calendarSuffix}`).val()));
    }
    $p.setData($control);
    $p.send($control);
};

const setFullCalendar = (calendarSuffix: string, calendarEl: HTMLElement) => {
    let language = String($('#Language').val());
    const supportedLanguages = ['en', 'zh', 'ja', 'de', 'ko', 'es', 'vi'];
    if (language === 'vn') {
        language = 'vi';
    }
    $(`#FullCalendar${calendarSuffix}`).css('clear', 'both');
    let calendarMiddle = new Date();
    if ($(`#CalendarStart${calendarSuffix}`).val() !== '') {
        calendarMiddle = new Date(
            (new Date(String($(`#CalendarStart${calendarSuffix}`).val())).getTime() +
                new Date(String($(`#CalendarEnd${calendarSuffix}`).val())).getTime()) /
                2
        );
    }
    if ($p.fullCalendars === undefined) {
        $p.fullCalendars = {};
    }
    if ($p.fullCalendars[calendarSuffix]) {
        $p.fullCalendars[calendarSuffix].destroy();
    }
    $p.fullCalendars[calendarSuffix] = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        firstDay: 1,
        initialDate: calendarMiddle,
        selectable: true,
        navLinks: true,
        businessHours: true,
        editable: true,
        height: 'auto',
        locale: supportedLanguages.includes(language) ? language : 'en',
        selectMirror: true,
        eventClick: (e: EventClickArg) => {
            window.location.href = `${String($('#ApplicationPath').val())}items/${e.event.id}/edit`;
        },
        select: newRecord(calendarSuffix),
        events: getEventsData(calendarSuffix),
        eventDrop: updateRecord(calendarSuffix),
        eventResize: updateRecord(calendarSuffix),
        eventDidMount: (info: EventMountArg) => {
            const eventElement = $(info.el);
            const endDate = new Date(removeTimeZoneSuffix(info.event.extendedProps.tooltipEnd)!);
            eventElement.attr(
                'title',
                `${htmlEncode(info.event.title)} -- ${$p.dateTimeFormatString(new Date(info.event.start!), info.event.extendedProps.format)}${info.event.end !== null && endDate.toLocaleString() !== info.event.start!.toLocaleString() ? ` - ${$p.dateTimeFormatString(new Date(endDate), info.event.extendedProps.format)}` : ''}`
            );
            if (info.event.extendedProps.StatusHtml) {
                if (info.view.type === 'listMonth') {
                    const $listGraphic = $(info.el).find('.fc-list-event-graphic');
                    $listGraphic.append($.parseHTML(info.event.extendedProps.StatusHtml)[0]);
                    $(info.el).find('.fc-list-event-dot').css('margin-right', '20px');
                } else {
                    const $eventTime = $(info.el).find('.fc-event-time');
                    $eventTime.prepend($.parseHTML(info.event.extendedProps.StatusHtml)[0]);
                }
                const $el = $(info.el);
                $el.find('.status-new').css({ color: 'black', border: 'solid 1px #000' });
                $el.find('.status-review').css('color', 'black');
                $el.find("[class^='status']").css({ padding: '1px 3px', margin: '0px 3px', width: '15px' });
            }
        },
        initialView: $(`#CalendarViewType${calendarSuffix}`).val(),
        lazyFetching: false,
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }
    });
    $p.fullCalendars[calendarSuffix].render();
    $('.fc-scrollgrid').addClass('no-drag');
};
$p.setCalendar = suffix => {
    let calendarElArr = $('#MainForm').find('.calendar-container').get();
    if (suffix) {
        calendarElArr = $('#MainForm').find(`div[id$="Calendar_${suffix}"].calendar-container`).get();
    }
    $(calendarElArr).each((_, value) => {
        let calendarSuffix = value.id.substring(value.id.indexOf('_'));
        calendarSuffix = calendarSuffix.indexOf('_') === -1 ? '' : calendarSuffix;
        if ($(`#CalendarType${calendarSuffix}`).val() === 'FullCalendar') {
            setFullCalendar(calendarSuffix, value);
        } else {
            $(`#Calendar${calendarSuffix} .container > div > div:not(.day)`).remove();
            let data: { group: string | undefined; items: CalendarItem[] }[];
            try {
                data = JSON.parse(String($(`#CalendarJson${calendarSuffix}`).val()));
            } catch {
                return;
            }
            data.forEach((element: { group: string | undefined; items: CalendarItem[] }) => {
                setCalendarGroup(element.group, element.items, calendarSuffix);
            });
            $(`#CalendarBody${calendarSuffix}`).addClass('no-drag');
        }
    });
};

$(() => {
    $(document).on('dblclick', '.Calendar .item', (event: JQuery.TriggeredEvent) => {
        $p.transition(String($('#BaseUrl').val()) + $(event.currentTarget).attr('data-id'));
    });
    $(document).on('click', '.Calendar .item .edit-icon', (event: JQuery.TriggeredEvent) => {
        $p.transition(String($('#BaseUrl').val()) + $(event.currentTarget).parent().parent().attr('data-id'));
    });
    $(document).on('mouseenter', '.Calendar .item', (event: JQuery.TriggeredEvent) => {
        const dataId = $(event.currentTarget).attr('data-id');
        if (dataId !== undefined) {
            $(`[data-id="${$.escapeSelector(dataId)}"]`).addClass('hover');
        }
    });
    $(document).on('mouseleave', '.Calendar .item', (event: JQuery.TriggeredEvent) => {
        const dataId = $(event.currentTarget).attr('data-id');
        if (dataId !== undefined) {
            $(`[data-id="${$.escapeSelector(dataId)}"]`).removeClass('hover');
        }
    });
    $(window).on('resize', () => {
        if ($('#Calendar').length === 1) {
            setTimeout(() => {
                $p.saveScroll();
                $p.setCalendar();
                $p.loadScroll();
            }, 10);
        }
    });
    $(document).on('dblclick', '.Calendar .ui-droppable', (event: JQuery.TriggeredEvent) => {
        const $target = $(event.currentTarget);
        if ($(event.target).is('.title') || event.target.closest('.title')) return;

        let calendarSuffix = $target
            .parents('div[id^="Calendar"]')
            .attr('id')!
            .substring($target.parents('div[id^="Calendar"]').attr('id')!.indexOf('_'));
        calendarSuffix = calendarSuffix.indexOf('_') === -1 ? '' : calendarSuffix;

        const names = String($(`#CalendarFromTo${calendarSuffix}`).val()).split('-');
        if (names[0] === 'UpdatedTime') return;
        const baseDate = new Date($target.attr('data-id')!);
        const form = document.createElement('form');
        const groupByName: string | undefined = (
            document.querySelector(`#CalendarGroupByColumnName${calendarSuffix}`) as HTMLInputElement | null
        )?.value;
        const groupByValue = $target[0].dataset.value;
        const addDate = (baseDate: Date, add: string) => {
            if (add === '') return '';
            const date = new Date(baseDate.getTime());
            date.setDate(date.getDate() + parseInt(add, 10));
            return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        };
        const addInput = (form: HTMLFormElement, name: string, value: string) => {
            if (!name) return;
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', `${String($(`#CalendarReferenceType${calendarSuffix}`).val())}_${name}`);
            input.setAttribute('value', value);
            form.appendChild(input);
        };

        form.setAttribute(
            'action',
            `${String($('#ApplicationPath').val())}items/${String($(`#CalendarSiteData${calendarSuffix}`).val())}/new`
        );
        form.setAttribute('method', 'post');
        form.style.display = 'none';
        document.body.appendChild(form);
        addInput(form, names[0], addDate(baseDate, String($(`#CalendarFromDefaultInput${calendarSuffix}`).val())));
        addInput(form, names[1], addDate(baseDate, String($(`#CalendarToDefaultInput${calendarSuffix}`).val())));
        if (groupByName && groupByValue !== undefined) addInput(form, groupByName, groupByValue);
        if ($('#Token').length) {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', 'Token');
            input.setAttribute('value', String($('#Token').val()));
            form.appendChild(input);
        }
        form.submit();
    });
    $(document).on('click', '.calendar-to-monthly', (event: JQuery.TriggeredEvent) => {
        const data = {
            CalendarTimePeriod: 'Monthly',
            CalendarDate: $(event.currentTarget).attr('data-id')
        };
        $p.ajax(location.href, 'post', data);
    });
});

const DEF_WIDGET_SIZE = 1;

var DATA = {};
var timer = new Timer();
var USERNAME = 'Hung';

function loadData(callback) {
    $.getJSON(dashboardFile, function(data) {
        callback(data);
    });
}

function parseURLParams(url) {
    var queryStart = url.indexOf('?') + 1,
        queryEnd = url.indexOf('#') + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, ' ').split('&'),
        parms = {},
        i,
        n,
        v,
        nv;

    if (query === url || query === '') return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split('=', 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var $currentWidget = undefined;

$(window).resize(() => {
    var colWidth = parseFloat(
        $('#board .grid')
            .css('grid-template-columns')
            .split(' ')[0],
        10
    );
    $('#board .grid').css('grid-auto-rows', colWidth);
});

function addParamElement(param) {
    var { element } = param;
    var eleMap = {
        input:
            '<div><span labelId="' +
            param.nameId +
            '"></span></div><input nameid="' +
            param.nameId +
            '" class="widgetParam">',
        select:
            '<div><span labelId="' +
            param.nameId +
            '"></span></div><select nameid="' +
            param.nameId +
            '" class="widgetParam"></select>'
    };
    $('.widgetParamCont').remove();
    if (eleMap[element.type]) {
        $('#widgetParamsCont').prepend(
            '<div class="widgetParamCont ' +
                param.nameId +
                '">' +
                eleMap[element.type] +
                '</div>'
        );
        if (element.type == 'select')
            for (var i in param.element.options) {
                var option = param.element.options[i];
                if (option.value && option.label)
                    $('.widgetParamCont select')
                        .first()
                        .append(
                            '<option value="' +
                                option.value +
                                '">' +
                                option.label +
                                '</option>'
                        );
            }
    }
    updateLabels();
}

function addWidgetSettingsListenners() {
    $('#widgetDeleteBtn').on('click', e => {
        var widget = getWidgetInstance($currentWidget.attr('id'));
        $currentWidget.remove();
        var params = { id: widget.id, type: 'remove', username: USERNAME };
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8080/user_widgets_modify',
            data: params,
            success: res => {
                console.log(res);
            }
        });

        $('#widgetParamsBox').hide();
    });
    $('#addWidgetBtn').on('click', () => {
        $currentWidget = undefined;
        setWidgetSizeSelectOpt(DEF_WIDGET_SIZE);
        $('.popBox').hide();
        $('#widgetDeleteBtn').hide();
        $('#widgetParamsBox').show();
        $('#widgetsSelect select').attr('disabled', false);
        $('#widgetsSelect select option').attr('selected', false);
    });

    $('#widgetsSelect select').on('change', e => {
        var widgetId = $('#widgetsSelect select')
            .find(':selected')
            .attr('labelId');
        if (widgetId == 'selectAWidget') {
            $('#addWidgetConfirmBtn').addClass('desactivated');
            $('.widgetParamCont').remove();
            return;
        }
        $('#addWidgetConfirmBtn').removeClass('desactivated');
        var widgetData = getWidgetById(widgetId);
        var widgetParams = widgetData.params;
        for (var i in widgetParams) addParamElement(widgetParams[i]);
    });

    $('.widgetSizeSelectOpt').on('click', e => {
        $('.widgetSizeSelectOpt').removeClass('selected');
        $('#' + e.currentTarget.id).addClass('selected');
    });

    $('#addWidgetConfirmBtn').on('click', () => {
        if ($('#addWidgetConfirmBtn').hasClass('desactivated')) return;
        var sizeId = $('.widgetSizeSelectOpt.selected').attr('id');
        var params = {};
        params.size = sizeId.substr(sizeId.length - 1);
        params.widgetId = $('#widgetsSelect select')
            .find(':selected')
            .attr('labelId');
        if ($('.widget_frequency').val())
            params.frequency = parseInt($('.widget_frequency').val(), 10);
        $('.widgetParam').each((i, e) => {
            var nameId = $(e).attr('nameId');
            var value = $(e).val();
            console.log(nameId + ' : ' + value);
            params[nameId] = value;
        });
        if ($currentWidget == undefined) {
            var newWidget = addWidget(params);
            params.id = newWidget.id;
            params.type = 'add';
            params.username = USERNAME;
            params.frequency = newWidget.frequency;
            $.ajax({
                method: 'POST',
                url: 'http://localhost:8080/user_widgets_modify',
                data: params,
                success: res => {
                    console.log(res);
                }
            });
        } else {
            var widget = getWidgetInstance($currentWidget.attr('id'));
            widget.setParams(params);
            widget.update();
            params.id = widget.id;
            params.type = 'modify';
            params.username = USERNAME;
            params.frequency = widget.frequency;
            setWidgetSize($currentWidget, params.size);
            $.ajax({
                method: 'POST',
                url: 'http://localhost:8080/user_widgets_modify',
                data: params,
                success: res => {
                    console.log(res);
                }
            });
        }
        $('.widgetParamCont').remove();
        $('#widgetsSelect select option')
            .first()
            .attr('selected', true);
        $('#widgetParamsBox').hide();
        setWidgetSizeSelectOpt(DEF_WIDGET_SIZE);
        $currentWidget = undefined;
    });
}

$(document).ready(() => {
    loadLangOptions(AVAILABLE_LANG);
    updateLabels(SELECTED_LANG);
    loadData(data => {
        DATA = data;
        loadUserServices(() => {
            showServices();
            loadWidgets();
            showWidgetsList();
            addWidgetSettingsListenners();
            loadUserWidgets(USERNAME);
            timer.start();
        });
    });
    urlParams = parseURLParams(window.location.href);
    $('#servicesBox').hide();
    $('#widgetParamsBox').hide();
    $('#changeLangBtn').on('mouseover', () => {
        $('#langOptBox').css('height', 'max-content');
    });
    $('#langOptBox').on('mouseover', () => {
        $('#langOptBox').css('height', 'max-content');
    });
    $('#langOptBox').on('mouseleave', () => {
        $('#langOptBox').css('height', '0px');
    });
    $('#username').text(urlParams.username[0]);
    $('#servicesBtn').on('click', () => {
        $('.popBox').hide();
        $('#servicesBox').show();
    });
    $('.closeBtn').on('click', e => {
        $(e.currentTarget)
            .parent()
            .hide();
    });
    $('#logoutBtn').on('click', () => {
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8080/logout',
            success: res => {
                if (res.status == 'success') window.location = res.redirect;
                console.log(res);
            }
        });
    });
    addNewWidgetListenners();
});

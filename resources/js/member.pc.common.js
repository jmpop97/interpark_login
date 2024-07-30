// Should support other domains like interpark-dev.com.
document.domain = '127.0.0.1';

var _var_init = function () {
    __window = window;
    __document = document;
    _location = __document.location;
    __history = __window.history;
    _window = $(__window);
    _document = $(__document);
    _html = $('html');
    _body = $('body');
    _head = $('head');
};
_var_init();

var IPK_ENV = {
    protocol: (_location.protocol).replace(':', ''),
    //host : 'm.interpark.com',
    host: _location.hostname,
    button: {
        login: $('#btn_login')
            .on('click', function () {
                IPK_MEMBER['event']['login']();
            }),
        relogin: $('#btn_relogin')
            .on('click', function () {
                location.reload();
            }),
        close: $('#close_window')
            .on('click', function (e) {
                e.preventDefault();
                var scope = $(this);
                if(window.opener) {
                    self.close();
                } else {
                    location.href = scope.attr('href');
                }
            })
    },
    input: {
        id: $('#userId')
            .on('keydown', function (e) {
                if((e.keyCode || e.which) === 13) {
                    var userId = $(document.getElementById("userId")).val();
                    if(jQuery.isEmptyObject(userId)) {
                        $("#userId").focus();
                    } else {
                        $("#userPwd").focus();
                    }

                }
            }),
        pwd: $('#userPwd')
            .on('keydown', function (e) {
                if((e.keyCode || e.which) === 13) {
                    IPK_MEMBER['event']['login']();
                }
            })
    },
    layer: {
        header: $('#header'),
        main: $('#layer_login'),
        info: $('#layer_info'),
        join_alert: $('#join_alert')
    },
    svc: function () {
        return this.query['fromSVC'] ? this.query['fromSVC'] : '';
    },
    window: function () {
        return this.query['winTarget'] ? this.query['winTarget'] : 'self';
    },
    cur_url: function () {
        return __document.location;
    },
    ret_url: function () {
        return this.query['retUrl'] ? this.query['retUrl'] : encodeURIComponent(this.cur_url());
    },
    is_app: false,
    doc_uri: {
        gate: 'https://m.interpark.com/auth/gate.html',
        login: '/login/form',
        logout: '/logout',
        join: 'https://m.interpark.com/auth/join/interpark.html',
        find_id: 'https://incorp.interpark.com/member/matchid.do?_method=initialPopUp',
        find_pw: 'https://incorp.interpark.com/member/matchpwd.do?_method=initialPopUp',
        site_agree: 'https://m.interpark.com/auth/marketing_agreement.html'
    },
    path: function (type) {
        //return `${this.protocol}://${this.host}${this.doc_uri[type]}?fromSVC=${this.svc()}&reqTp=${this.query['reqTp']}&retUrl=${this.ret_url()}`;
        if(type === "join") {
            try {
                EsLogMinor.sendLog({
                    "tagging": EGS_EVENT_TAGGING,
                    "action": "memberjoin_select_auth",
                    "site": __EGS_DATAOBJ.site,
                    "section_id": "memberjoin_basic"
                });
            } catch (e) {
            }
            var o_form = $('#loginFrm');
            var o_login_tp = o_form.find('#LOGIN_TP').val();
            if(o_login_tp.length !== 4) {
                o_login_tp = "1000";
            }

            var fullUrl = "";

            if(this.doc_uri[type].indexOf("https://") >= 0 || this.doc_uri[type].indexOf("http://") >= 0) {
                fullUrl = this.doc_uri[type];
            } else {
                fullUrl = [this.protocol, '://', this.host, this.doc_uri[type]].join('');
            }

            return [fullUrl,
                '?fromSVC=', this.svc(),
                '&reqTp=', this.query['reqTp'],
                '&chk=www',
                '&loginTp=', o_login_tp,
                '&retUrl=', this.ret_url()].join('');
        } else if(this.doc_uri[type].indexOf("https://") >= 0 || this.doc_uri[type].indexOf("http://") >= 0) {
                return this.doc_uri[type];
        } else {
            return [this.protocol, '://', this.host, this.doc_uri[type],
                '?fromSVC=', this.svc(),
                '&reqTp=', this.query['reqTp'],
                '&retUrl=', this.ret_url()].join('');
        }
    },
    query: {},
    init: function () {
        if($('#loginFrm').find("#fromSVC").val() !== '') {
            this.query["fromSVC"] = $('#loginFrm').find("#fromSVC").val();
        }

        var o_form = $('#loginFrm');
        var captchaWrapper = $(".captchaWrap");
        var captchaFrame = captchaWrapper.find("#oCaptchaFrame");
        var oCheckCaptcha = o_form.find('#oCheckCaptcha');

        var visibleCaptcha = captchaFrame.attr("data-isc");
        if(visibleCaptcha === 'false') {
            captchaFrame.attr("src", captchaFrame.attr("data-src"));
            oCheckCaptcha.val('');
            captchaWrapper.css("display", "block");
        }
    }
};
IPK_ENV.init();


var IPK_MEMBER = {
    move: function (o) {
        switch (o.action) {
            case 'find_id':
            case 'find_pw':
                try {
                    EsLogMinor.sendLog({
                        "tagging": EGS_EVENT_TAGGING,
                        "action": "login",
                        "site": __EGS_DATAOBJ.site,
                        "section_id": o.action
                    });
                } catch (e) {
                }
                if(o.target === 'popup') {
                    var url = [IPK_ENV['path'](o.action), '&winTarget=', o.target].join('');
                    window.open(url, 'popup' + o.action, ['width=480', ' height=340', ' scrollbars=yes'].join(','));
                } else {
                    window.location = IPK_ENV['path']('login');
                }
                break;
            default :
                if(o.target === 'popup') {

                } else {
                    window.location.href = IPK_ENV['path'](o.action);
                }
                break;
        }
    },
    event: {
        submitted: false,
        login: function () {
            var form = $('#loginFrm');
            var method = form.attr("data-method");
            if(method === "ajax") {
                var userId = $(document.getElementById("userId")).val().trim();
                if($(document.getElementById("userId")).attr('placeholder') == userId) {
                    userId = "";
                }

                var userPwd = $(document.getElementById("userPwd")).val();
                if($(document.getElementById("userPwd")).attr('placeholder') == userPwd) {
                    userPwd = "";
                }

                if(userId == "") {
                    $(".error").removeClass('lock').html('아이디를 입력해주세요.').show();
                    return;
                } else if(userPwd == "") {
                    $(".error").removeClass('lock').html('비밀번호를 입력해주세요.').show();
                    return;
                }
                //캡챠 체크
                var captchaWrapper = $(".captchaWrap");
                var captchaFrame = captchaWrapper.find("#oCaptchaFrame");
                var isCaptcha = captchaFrame.attr("data-isc");
                if(isCaptcha === 'false' && $("#oCheckCaptcha").val().trim() === '') {
                    $(".error").removeClass('lock').html('자동입력방지 문자를 입력해주세요.').show();
                    return;
                } else if(isCaptcha === 'false' && $("#oCheckCaptcha").val().trim().length !== 6) {
                    $(".error").removeClass('lock').html('자동입력방지 문자 6자리를 입력해주세요.').show();
                    return;
                }
                return IPK_MEMBER.event.login_ajax();
            } else {
                return true;
            }
        },
        login_ajax: function () {
            if(IPK_MEMBER.event.submitted == true) return;
            var o_form = $('#loginFrm');

            var o_login_tp = o_form.find('#LOGIN_TP').val();
            var o_action = o_form.attr("action");

            try {
                EsLogMinor.sendLog({
                    "tagging": EGS_EVENT_TAGGING,
                    "action": "login",
                    "site": __EGS_DATAOBJ.site,
                    "section_id": "login_basic"
                });
            } catch (e) { }

            if(o_login_tp.length === 4) {
                o_login_tp = o_login_tp + "00";
            } else {
                o_login_tp = "100000";
            }

            IPK_MEMBER.event.submitted = true;

            o_form.ajaxSubmit({
                type: 'post',
                url: o_action,
                async: false,
                timeout: 7000,
                dataType: 'json',
                success: function (res) {
                    $("#snsTp, #snsId").val('');
                    switch (res.result_code) {
                        case '00':  // 로그인 성공
                            location.replace(res.callback_url);
                            break;
                        default:
                            IPK_MEMBER.event.submitted = false;
                            $(".error").removeClass('lock').html("일시적인 오류가 발생하였습니다.\n잠시 후 다시 시도하시기 바랍니다.").show();
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    try {
                        IPK_MEMBER.event.submitted = false;
                        var parseJson = $.parseJSON(xhr.responseText);
                        var resultCode = parseJson.result_code;
                        var captchaWrapper = $(".captchaWrap");
                        var caution = captchaWrapper.find(".caution");
                        var captchaFrame = captchaWrapper.find("#oCaptchaFrame");
                        var isCaptcha = captchaFrame.attr("data-isc");
                        var oCheckCaptcha = o_form.find('#oCheckCaptcha');

                        switch (resultCode) {
                            case '01':  // 캡챠 오류
                                captchaFrame.attr("src", captchaFrame.attr("data-src"));
                                oCheckCaptcha.val('');
                                captchaWrapper.css("display", "block");

                                $('#oCaptchaFrame').attr('src', $('#oCaptchaFrame').attr('src'));
                                $(".error").removeClass('lock').html('자동입력방지 문자를 잘못 입력하셨습니다.').show();
                                break;
                            case '05':  // 해당 ID에 회원 없음
                                $(".error").removeClass('lock').html('아이디 또는 비밀번호를 잘못 입력하셨습니다.').show();

                                if(isCaptcha === 'false') {
                                     captchaFrame.attr("src", captchaFrame.attr("data-src"));
                                     oCheckCaptcha.val('');
                                     captchaWrapper.css("display", "block");
                                }
                                break;
                            case '02':  // 비번 매칭 오류
                                $(".error").removeClass('lock').html('(로그인 오류 '+parseJson.pwdFailCnt+'회)<br>5회 이상 로그인 오류 시 <span>보안을 위해 로그인이 제한됩니다.</span>').show();

                                if(isCaptcha === 'false') {
                                    captchaFrame.attr("src", captchaFrame.attr("data-src"));
                                    oCheckCaptcha.val('');
                                    captchaWrapper.css("display", "block");
                                }
                                break;
                            case '03':  // 비번 미설정 사용자
                                $(".error").removeClass('lock').html('아이디 또는 비밀번호를 잘못 입력하셨습니다.<br>SNS 회원이신 경우 연결된 SNS로 로그인해주세요.').show();

                                if(isCaptcha === 'false') {
                                    captchaFrame.attr("src", captchaFrame.attr("data-src"));
                                    oCheckCaptcha.val('');
                                    captchaWrapper.css("display", "block");
                                }
                                break;
                            case '04':  // 비번 5회 초과
                                captchaFrame.attr("src", captchaFrame.attr("data-src"));
                                oCheckCaptcha.val('');
                                captchaWrapper.css("display", "block");

                                $(".error").removeClass('lock').html('로그인 오류가 5회 초과했습니다.<br><span>정보보호를 위해 자동입력방지 문자를 함께 입력해주세요.</span>').show();
                                break;
                            case '06':  // Black list ID 대상.
                                var recertMthd = parseJson.recertMthd;
                                if(recertMthd === "05" || recertMthd === "07") {
                                    $(".error").removeClass('lock').html('로그인이 제한된 계정입니다.\n관련 문의는 고객센터(1544-1555)를 통해 연락주세요!').show();
                                } else if(recertMthd === "08") {
                                    document.frmUserDorm.mbrId.value = parseJson.mbrId;
                                    document.frmUserDorm.mbrInfo.value = parseJson.mbrInfo;
                                    var loginLimitUrl = "https://incorp.interpark.com/member/login.do?_method=loginLimitDupleCert&mbrId=" + encodeURIComponent(parseJson.mbrId) + "&mbrInfo=" + encodeURIComponent(parseJson.mbrInfo);

                                    if(window.self !== window.top) { // iframe 일때 부모창 이동
                                        window.parent.location.href = loginLimitUrl;
                                    } else {
                                        window.location.href = loginLimitUrl;
                                    }
                                } else { //re_cert_target mthd = 02,03,06 일때
                                    $(".error").removeClass('lock').html('비정상적인 접속 시도로 계정 보호를 위해 로그인 잠김처리 되었습니다. <span id="userDormPopup" style="cursor:pointer;color: #ef3e42;">본인확인 및 비밀번호 재설정</span>').show();
                                    $("#userDormPopup").click(function(){blockIdPopUp(parseJson.mbrId, parseJson.mbrInfo);});
                                    document.frmUserDorm.mbrId.value = parseJson.mbrId;
                                    document.frmUserDorm.mbrInfo.value = parseJson.mbrInfo;
                                    var POPUP_URL = "https://incorp.interpark.com/member/login.do?_method=loginlimitPopup&mbrId=" + encodeURIComponent(parseJson.mbrId) + "&mbrInfo=" + encodeURIComponent(parseJson.mbrInfo);
                                    window.open(POPUP_URL, 'userDormPopup', 'width=340,height=330,scrollbars=yes');
                                }
                                break;
                            case '09':
                                $(".error").removeClass('lock').html('로그인 정보 입력 시간이 만료 되었습니다. 새로고침 후 입력 해 주세요.').show();

                                if(isCaptcha === 'false') {
                                    captchaFrame.attr("src", captchaFrame.attr("data-src"));
                                    oCheckCaptcha.val('');
                                    captchaWrapper.css("display", "block");
                                }
                                alert("로그인 정보 입력 시간이 만료 되었습니다. 재로그인 해주세요.");
                                location.reload();
                                break;
                            case '10':
                                $(".error").removeClass('lock').html('비정상적인 접속시도가 탐지되어 계정보호를 위해<br>로그인 잠김처리 되었습니다. 자세한 사항은 고객센터로 문의해주세요.').show();

                                if(isCaptcha === 'false') {
                                    captchaFrame.attr("src", captchaFrame.attr("data-src"));
                                    oCheckCaptcha.val('');
                                    captchaWrapper.css("display", "block");
                                }
                                break;
                            case '99':
                            default:
                                $(".error").removeClass('lock').html("예상하지 못한 오류가 발생하였습니다.\n잠시 후 다시 시도하시기 바랍니다.").show();
                        }
                    } catch (e) {
                        $(".error").removeClass('lock').html("일시적인 오류가 발생하였습니다.\n잠시 후 다시 시도하시기 바랍니다.").show();
                    }
                }
            });
        },
        login_cancel: function () {
            if(window.opener) {
                self.close();
            } else {
                window.history.back();
            }
            return false;
        },
        remove_blank: function (o) {
            o.value = o.value.replace(/ /gi, '');
        },
    }
};

$('.ipk_member').on('click', function () {
    var scope = $(this), o_data = JSON.parse(scope.attr('data-set'));

    if(o_data.ret_url) {
        IPK_ENV['query']['retUrl'] = encodeURIComponent(o_data.ret_url);
    }

    if(o_data.callback) {
        IPK_ENV['query']['callback'] = o_data.callback;
    }

    if(o_data.req_tp) {
        IPK_ENV['query']['reqTp'] = o_data.req_tp;
        IPK_ENV['protocol'] = o_data.req_tp;
    }

    if(o_data.action === "join_page") {
        var o_form = $('#loginFrm');
        var o_login_tp = o_form.find('#LOGIN_TP').val();
        if(o_login_tp.length !== 4) {
            o_login_tp = "1000";
        }

        var page = "";
        if (o_data.profile === "LOCAL" ||  o_data.profile === "DEV") {
            page = "https://member-dev.interpark.com/signup?_method=initial";
        } else if (o_data.profile === "STAGE") {
            page = "https://member-stg.interpark.com/signup?_method=initial";
        } else {
            page = "https://member.interpark.com/signup?_method=initial";
        }

        var join_site_tp = o_login_tp.substring(0,2);
        var joinUrl = [
            page,
            "&join_site_tp=",join_site_tp,
            "&reqSite=",IPK_ENV.svc()
        ].join("");
        parent.location.href=joinUrl;
        return;
    }
    IPK_MEMBER['move'](o_data);
});

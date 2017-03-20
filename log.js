var bz_res = {
    js_yyyy_mm_dd_hh_mm_ss: function() {
        now = new Date();
        year = "" + now.getFullYear();
        month = "" + (now.getMonth() + 1);
        if (month.length == 1) { month = "0" + month; }
        day = "" + now.getDate();
        if (day.length == 1) { day = "0" + day; }
        hour = "" + now.getHours();
        if (hour.length == 1) { hour = "0" + hour; }
        minute = "" + now.getMinutes();
        if (minute.length == 1) { minute = "0" + minute; }
        second = "" + now.getSeconds();
        if (second.length == 1) { second = "0" + second; }
        return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    },
    hasClass: function(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
}

window.select = function(query, elm) {
    var elm = elm != '' && elm != undefined ? elm : document;
    return elm.querySelectorAll(query);
}

var bz_whatsapp = {
    workon: "",
    modelHtml: '<div class="backdrop bz_whatsapp_model"><div class="popup-container"><div class="popup popup-tower"><div class="drawer-container drawer-container-left"><div class="drawer">' + '	<header class="drawer-header-popup">' + '	<div class="drawer-title" style="font-weight:500;font-size:19px;line-height:19px;">' + '		<div style="text-align:initial;width:48px;opacity:0.7;" class="drawer-title-action">' + '		<span class="icon btn-close-drawer icon-x-light bz_whatsapp_model_close" data-ignore-capture="any"></span>' + '	</div><span class="drawer-title-body">Forward message to</span></div>' + ' </header><div class="drawer-body drawer-editable" data-list-scroll-container="true"><input type="number" placeholder="message start from" id="msg_start_from"/><input type="number" placeholder="message users limit" id="msg_users_limit"/><textarea class="bz_broadcast_msgtext" style="min-height: 200px;" type="text" placeholder="enter message"></textarea><div class="bz_whatsapp_send_msg" >Send Message</div></div>' + '</div></div> </div></div></div>',
    init: function() {
        setTimeout(function() {
            var hdr = select('.pane-list-header .pane-list-user')[0];
            if (hdr != undefined) {
                hdr.style.display = "flex";
                var w = hdr.innerHTML + '<div id="sendMessage" class="bz_btn">Send Mesage</div><div id="forwardMesage" class="bz_btn">Forward Mesage</div>';
                hdr.innerHTML = '';
                hdr.innerHTML = w;

                select('#forwardMesage')[0].addEventListener("click", function() {
                    bz_whatsapp.workon = "Message";
                    var findMsglist = select('.pane-chat-msgs .message-list .msg .message');
                    if (findMsglist.length < 1) {
                        alert('no msg found');
                        return '';
                    }
                    var lastMsg = findMsglist[findMsglist.length - 1];
                    bz_whatsapp.validate_msg(lastMsg, function() {
                        bz_whatsapp.contacts = 0;
                        var z = document.createElement('div');
                        z.innerHTML = bz_whatsapp.modelHtml;
                        document.getElementById("app").appendChild(z);

                        select('.bz_whatsapp_model_close')[0].addEventListener("click", function() {
                            select('.bz_whatsapp_model')[0].remove();
                        });

                        select('.bz_whatsapp_send_msg')[0].addEventListener("click", function() {
                            var msg = select(".bz_broadcast_msgtext")[0].value;
                            bz_whatsapp.msg_start_from = Number(select("#msg_start_from")[0].value) - 1;
                            bz_whatsapp.msg_users_limit = Number(select("#msg_users_limit")[0].value);
                            select('.bz_whatsapp_model')[0].remove();
                            bz_whatsapp.msg = { text: msg };
                            bz_whatsapp.forward_msg();
                        });

                    }, function() {

                    });

                });

                select('#sendMessage')[0].addEventListener("click", function() {
                    bz_whatsapp.workon = "getmobileno";
                    var z = document.createElement('div');
                    z.innerHTML = bz_whatsapp.modelHtml;
                    document.getElementById("app").appendChild(z);

                    select('.bz_whatsapp_model_close')[0].addEventListener("click", function() {
                        select('.bz_whatsapp_model')[0].remove();
                    });

                    select('.bz_whatsapp_send_msg')[0].addEventListener("click", function() {
                        var msg = select(".bz_broadcast_msgtext")[0].value;
                        bz_whatsapp.msg_start_from = Number(select("#msg_start_from")[0].value) - 1;
                        bz_whatsapp.msg_users_limit = Number(select("#msg_users_limit")[0].value);
                        select('.bz_whatsapp_model')[0].remove();
                        bz_whatsapp.msg = { text: msg };
                        bz_whatsapp.contacts = 0;
                        bz_whatsapp.normal_msg();
                    });
                });
            } else {
                bz_whatsapp.init();
            }
        }, 1000);
    },
    validate_msg: function(lastMsg, success, error) {
        if (bz_res.hasClass(lastMsg, 'message-in')) {
            alert('last message not Outgoing');
            return '';
        }
        var classlist = select('.icon', lastMsg)[0].classList.toString(),
            msg_loader = select('.spinner-container', lastMsg),
            msg_send = classlist.match('icon-msg'),
            msg_img = select('img.image-thumb-body', lastMsg);
        if (msg_img.length < 1) {
            alert('Image not found in last message');
            return '';
        }
        if (msg_loader != undefined && msg_loader.length > 0) {
            error();
            return '';
        } else {
            var msg_not_send = select('.btn-meta', lastMsg);
            if (msg_not_send != undefined && msg_not_send.length > 0) {
                msg_not_send[0].click();
                error();
                return '';
            }
        }
        if (msg_send != null || msg_send.length > 1) {
            success();
        } else {
            console.log('error found');
            error();
        }
    },
    normal_msg: function(totalno, crntno, index) {

        bz_whatsapp.getContacts(".menu-item .icon-chat", function() {

            var my_contacts = select(".contact");
            if (bz_whatsapp.contacts == 0) {
                bz_whatsapp.contacts = my_contacts.length;
            }

            totalno = totalno == undefined ? bz_whatsapp.msg_users_limit : totalno;
            totalno = totalno == 'all' ? bz_whatsapp.contacts : totalno;
            crntno = crntno == undefined ? bz_whatsapp.msg_start_from : crntno;
            index = index == undefined ? 1 : index;
            console.log(index + ' , ' + totalno + ' , ' + bz_whatsapp.contacts);


            if (index <= totalno && crntno < bz_whatsapp.contacts) {
                var reactid = my_contacts[crntno];
                reactid.click();
                setTimeout(function() {
                    setTimeout(function() {
                        crntno++;
                        var kk = select('.pane-chat .block-compose')[0];
                        select('.input-emoji .input-placeholder', kk)[0].style.display = "none";
                        select('.input-emoji .input', kk)[0].innerHTML = bz_whatsapp.msg.text;
                        select('.input-emoji .input', kk)[0].dispatchEvent(new Event('input', { 'bubbles': true }));
                        select('.send-container', kk)[0].click();
                        setTimeout(function() {
                            index++;
                            if (index <= totalno && crntno < bz_whatsapp.contacts) {
                                bz_whatsapp.normal_msg(totalno, crntno, index);
                            }
                        }, 7000);
                    }, 4000);
                }, 3000);
            }
        });
    },
    forward_msg: function(totalno, crntno, index) {
        var msg_no = index == 1 || index == undefined ? 1 : 2;
        var findMsglist = select('.pane-chat-msgs .message-list .msg .message'),
            lastMsg = findMsglist[findMsglist.length - msg_no];
        if (bz_res.hasClass(lastMsg, "message-e2e_notification")) {
            lastMsg = findMsglist[findMsglist.length - 3];
        }
        setTimeout(function() {
            bz_whatsapp.validate_msg(lastMsg, function() {
                bz_whatsapp.fire_event(lastMsg, "mouseover");
                bz_whatsapp.fire_event(select('.btn-forward-chat', lastMsg)[0], "click");
                setTimeout(function() {
                    var ty = select('.backdrop .checkbox');
                    if (ty.length > 0) {
                        bz_whatsapp.readContacts(totalno, crntno, index);
                    } else {
                        bz_whatsapp.forward_msg(totalno, crntno, index);
                    }
                }, 100);
            }, function() {
                bz_whatsapp.forward_msg(totalno, crntno, index);
            });
        }, 1500);
    },
    contacts: 0,
    msg: {},
    msg_start_from: 0,
    msg_users_limit: 4,
    fire_event: function(elm, name) {
        if (elm.fireEvent) { elm.fireEvent('on' + name); } else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(name, true, false);
            elm.dispatchEvent(evObj);
        }
    },
    getContacts: function(elm, success) {
        setTimeout(function() {
            if (elm) {
                bz_whatsapp.fire_event(select(elm)[0], "mousedown");
            }

            function auto_scroll(total, cntr, elmObj) {
                if (total >= cntr) {
                    if (total == 1) {
                        success();
                    }
                    elmObj.scrollTop = 648 * cntr;
                    cntr++;
                    setTimeout(function() {
                        auto_scroll(total, cntr, elmObj);
                        if (total == cntr) {
                            success();
                        }
                    }, 300);
                }
            }

            setTimeout(function() {
                var objDiv = select(".drawer-body")[0];
                var scrl_cuntr = objDiv.scrollHeight / 648;
                scrl_cuntr = Math.floor(scrl_cuntr);
                scrl_cuntr = scrl_cuntr == 0 ? 1 : scrl_cuntr;
                var i = 1;
                auto_scroll(scrl_cuntr, i, objDiv);
            }, 900);

        }, 1500);
    },
    readContacts: function(totalno, crntno, index) {
        bz_whatsapp.getContacts(null, function() {
            var my_contacts = select(".checkbox");
            if (bz_whatsapp.contacts == 0) {
                bz_whatsapp.contacts = my_contacts.length;
                select('.icon.btn-close-drawer')[0].click();
                bz_whatsapp.sendMessage();
            } else {
                if (index <= totalno && crntno < bz_whatsapp.contacts) {
                    var reactid = my_contacts[crntno];
                    reactid.click();
                    setTimeout(function() {
                        select('.backdrop .btn-action')[0].click();
                        setTimeout(function() {
                            crntno++;
                            var kk = select('.pane-chat .block-compose')[0];
                            select('.input-emoji .input-placeholder', kk)[0].style.display = "none";
                            select('.input-emoji .input', kk)[0].innerHTML = bz_whatsapp.msg.text;
                            select('.input-emoji .input', kk)[0].dispatchEvent(new Event('input', { 'bubbles': true }));
                            select('.send-container', kk)[0].click();
                            setTimeout(function() {
                                index++;
                                bz_whatsapp.sendMessage(totalno, crntno, index);
                            }, 7000);
                        }, 4000);
                    }, 3000);
                }
            }
        });
    },
    sendMessage: function(totalno, crntno, index) {
        totalno = totalno == undefined ? bz_whatsapp.msg_users_limit : totalno;
        totalno = totalno == 'all' ? bz_whatsapp.contacts : totalno;
        crntno = crntno == undefined ? bz_whatsapp.msg_start_from : crntno;
        index = index == undefined ? 1 : index;
        console.log(index + ' , ' + totalno + ' , ' + bz_whatsapp.contacts);
        if (index <= totalno && crntno < bz_whatsapp.contacts) {
            bz_whatsapp.forward_msg(totalno, crntno, index);
        }
    }
};

bz_whatsapp.init();

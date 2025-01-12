nullHandleForThisLocalStorageProperty("allAlarmSavedList", []), nullHandleForThisLocalStorageProperty("mode", { modeClassName: "bg-light", modeSelectedIndex: 0 });
var defAznSrc = "audio/Azan0.mp3",
    defAlrmSrc = "audio/Alarm0.mp3";
nullHandleForThisLocalStorageProperty("defaultAzanTone", { nthNumberSelected: 0, src: defAznSrc }),
    nullHandleForThisLocalStorageProperty("defaultAlarmTone", { nthNumberSelected: 0, src: defAlrmSrc }),
    nullHandleForThisLocalStorageProperty("setting", { automaticallyDeleleRingedAlarms: !1 }),
    nullHandleForThisLocalStorageProperty("userInfo", []),
    nullHandleForThisLocalStorageProperty("todayTimings", []);
let runningAudio = !1;
const azanAudio = new Audio(defAznSrc);
azanAudio.setAttribute("preload", "metadata");
const alarmAudio = new Audio(defAlrmSrc);
alarmAudio.setAttribute("preload", "metadata"), (alarmAudio.loop = !0);
const setAlarmBtn = document.getElementById("setAlarm"),
    alarmInput = document.getElementById("alarmInput"),
    noteAlarmInput = document.getElementById("notesAlarmInput"),
    setAlarmList = document.getElementById("setAlarmList"),
    alertBox = document.getElementById("alertBox"),
    deleteAllAlarms = document.getElementById("deleteAllAlarms"),
    totalAlarm = document.getElementById("totalAlarm"),
    filteringBox = document.getElementById("filtering-msg"),
    pages = document.getElementsByClassName("pages"),
    tcle = Array.from(document.getElementsByClassName("tackle")),
    countryOptions = $("#country option"),
    cty = document.getElementById("city"),
    setLocation = document.getElementById("setLocation"),
    azanDataDisplayToday = document.getElementById("azanDataDisplayToday"),
    azanDataDisplayMonth = document.getElementById("azanDataDisplayMonth"),
    tbody = document.getElementById("tbody"),
    tbody2 = document.getElementById("tbody2"),
    azanBox = document.getElementById("azanVoice"),
    playAudio1 = document.getElementById("playAudio1"),
    pauseAudio1 = document.getElementById("pauseAudio1"),
    stopAudio1 = document.getElementById("stopAudio1"),
    playAudio2 = document.getElementById("playAudio2"),
    pauseAudio2 = document.getElementById("pauseAudio2"),
    stopAudio2 = document.getElementById("stopAudio2");
function goToPage(e) {
    const t = e.id.replace("Btn", "") + "Page";
    Array.from(pages).forEach(function (e) {
        e.classList.add("none");
    }),
        document.getElementById(t).classList.remove("none");
}
$(".navbar-nav li").click(function () {
    $("#toggleMenuBar").click();
});
let defaultTone,
    collapseIds = [];
const today = new Date();
function clearAllTimeouts() {
    const e = window.setTimeout(() => {
        for (let t = e; t >= 0; t--) window.clearInterval(t);
    }, 0);
}
function fmt(e) {
    e = e.split(" ")[0].split(":");
    let t = parseInt(e[0]),
        n = ":" + parseInt(e[1]);
    return t > 12 ? ((t -= 12), t + n + " PM") : t + n + " AM";
}
function removeUnknownLocalStorageProperties() {
    const e = localStorage.length,
        t = ["fetchedLastTime", "dontShowAgain", "isEndMaxDone", "allAlarmSavedList", "defaultAlarmTone", "defaultAzanTone", "mode", "setting", "aboutAzan", "userInfo", "todayTimings", "autoTurnOnAzan"];
    for (let n = 0; n < e; n++) {
        const e = localStorage.key(n);
        t.includes(e) || localStorage.removeItem(e);
    }
}
function getAzanObjects() {
    const e = [],
        t = JSON.parse(localStorage.allAlarmSavedList),
        n = t.length;
    for (let a = 0; a < n; a++) {
        const n = t[a];
        n.isItForAzan && e.push(n);
    }
    return e;
}
function removeAzanObjectsFromSaved() {
    clearAllTimeouts();
    const e = [],
        t = JSON.parse(localStorage.allAlarmSavedList),
        n = t.length;
    for (let a = 0; a < n; a++) {
        const n = t[a];
        n.isItForAzan || e.push(n);
    }
    return localStorage.setItem("allAlarmSavedList", JSON.stringify(e)), e;
}
function getDateTimeLocalToDateObj(e) {
    return new Date(e);
}
function makeStr(e = 30, t = !1) {
    for (var n = "", a = t || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", o = a.length, l = 0; l < e; l++) n += a.charAt(Math.floor(Math.random() * o));
    return n;
}
function removeNullsFromThisList(e) {
    return e.filter((e) => null !== e);
}
function removeThisValuesItemsFromObjectsList(e, t, n) {
    return e.filter((e) => e[t] === n);
}
function getLocalStorageSizeInKB(e = !1) {
    let t,
        n,
        a = 0;
    for (n in localStorage) localStorage.hasOwnProperty(n) && ((t = 2 * (localStorage[n].length + n.length)), (a += t));
    return e ? parseFloat(((a / 1024 / 5120) * 100).toFixed(2)) : a / 1024;
}
function getGroupingResult(e, t) {
    const n = e.getTime(),
        a = t.getTime(),
        o = e.getDate(),
        l = e.getMonth(),
        i = e.getFullYear(),
        r = t.getDate(),
        s = t.getMonth(),
        c = t.getFullYear(),
        d = r == o,
        m = l == s,
        u = i == c,
        g = parseInt((a - n) / 1e3 / 60) < 10081;
    return `\n    <box class="d-flex align-items-center justify-space-between">\n        <p class="title my-2 w-100 text-center border rm-bg-info bg-secondary white">${n > a
        ? "Past"
        : d && m && u
            ? "Today"
            : r === o + 1 && m && u
                ? "Tomorrow"
                : g
                    ? "This Week"
                    : m && u
                        ? "This Month"
                        : (u && l === s + 1) || (c === i + 1 && s === l - 11)
                            ? "Next Month"
                            : u
                                ? "This Year"
                                : c === i + 1
                                    ? "Next Year"
                                    : "After"
        }</p>\n        <i class="px-3 bg-secondary white bi bi-arrows-angle-expand expandOrCollapseItems onclick="collapseTillNext()"></i>\n    </box>\n        `;
}
function sortBeutify() {
    const e = [];
    $("p.title").each(function () {
        e.includes(this.innerText) ? this.parentElement.remove() : e.push(this.innerText);
    });
}
function collapseTillNext(e) {
    let i = 0;
    var n;
    e.classList.toggle("bi-arrows-angle-contract");
    n = e.parentElement.nextElementSibling.nextElementSibling;
    console.log(n);
    while (true) {
        i++;
        n.classList.toggle("show");
        const x = n.parentElement.nextElementSibling;
        if (x === null || x.firstElementChild.nodeName === "BOX") {
            break;
        } else {
            n = n.parentElement.nextElementSibling.firstElementChild.nextElementSibling;
        }
        if (i > 50) {
            break;
        }
    }
}
function nullHandleForThisLocalStorageProperty(e, t = !1, n = !0) {
    let a = [];
    const o = JSON.parse(localStorage.getItem(e));
    (null !== o && o !== JSON.parse('[]')) || (t ? (n ? localStorage.setItem(e, JSON.stringify(t)) : sessionStorage.setItem(e, JSON.stringify(t))) : n ? localStorage.setItem(e, JSON.stringify(a)) : sessionStorage.setItem(e, JSON.stringify(t))),
        (toSave = JSON.parse(localStorage.getItem("allAlarmSavedList")));
}
function isObLnN(e, t) {
    return Object.keys(JSON.parse(e)).length === t;
}
var mode = localStorage.getItem("mode"),
    toSave = [];
function isThereNoAlarm() {
    nullHandleForThisLocalStorageProperty("allAlarmSavedList");
    return 0 === removeThisValuesItemsFromObjectsList(JSON.parse(localStorage.getItem("allAlarmSavedList")), "isItForAzan", !1).length;
}
function btnsClearify() {
    isThereNoAlarm() ? deleteAllAlarms.setAttribute("disabled", !0) : deleteAllAlarms.removeAttribute("disabled");
}
function getDateTimeLocalToDateObj(e) {
    return new Date(e);
}
function addInLocalStorage(e, t, n = !0, a = !0, o = !1, l = !1) {
    0 === e.length && (e = "Alarm");
    let i = { isItForAzan: !n, id: "id" + new Date(t).getTime(), title: e, datetime: t, isRunningSetTimeout: !1, isTurnedOn: a, isDoneRingingOrStarted: !1, endMax: o, realTime: l };
    nullHandleForThisLocalStorageProperty("allAlarmSavedList"), toSave.push(i), localStorage.setItem("allAlarmSavedList", JSON.stringify(toSave));
}
function showMsgIfNoAlarm() {
    isThereNoAlarm() && (setAlarmList.innerHTML = "<h3 style=\"font-size:1.3rem;text-align:center;font-family:'Arial';opacity:.4;\">No Alarm</h3>");
}
function showAlert(e = "Something went wrong, please try again", t = 3e3, n = !0, a = !1, o = 1e7) {
    const l = makeStr(10),
        i = `\n    <div id="${l}" class="alert ${n ? "alert-success" : "alert-danger"} alert-dismissible fade show text-center fixed-top alert-div" role="alert" style="zindex:${o}">\n        ${n ? '<i class="bi bi-check-circle-fill alert-icon"></i>' : '<i class="bi bi-exclamation-circle-fill alert-icon"></i>'
            }\n        <span>${e}</span>\n        <strong> ${a || ""}</strong>\n        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>\n    </div>\n    `;
    alertBox.innerHTML = i;
    const r = $("#" + l);
    return (
        setTimeout(() => {
            r.remove();
        }, t),
        l
    );
}
function stopAlarm() { }
function deleteAlarmFromLocalStorage(e) {
    for (let t = 0; t < toSave.length; t++) toSave[t].id === e && (delete toSave[t], localStorage.setItem("allAlarmSavedList", JSON.stringify(toSave)));
    showAlarmList(!0), btnsClearify();
}
function deleteAlarmsAllFromLocalStorage() {
    $(".alarmBoxPieces").hide(510),
        setTimeout(() => {
            0 !== $(".armlaBoxPieces").length && $(".alarmBoxPieces").remove(), $("#setAlarmList").empty(1010), (toSave = []), localStorage.setItem("allAlarmSavedList", JSON.stringify(toSave)), showAlarmList(!0), btnsClearify();
        }, 500);
}
function getDateObjectOfNextDayIfInFuture(e) {
    const t = new Date().getTime();
    let n = new Date(e).getTime() + 864e5;
    for (; n < t;) n += 864e5;
    return new Date(n);
}
function getAlarmObjectPropertyValueById(e, t, n = !1) {
    const a = JSON.parse(localStorage.getItem("allAlarmSavedList")),
        o = a.length;
    for (let l = 0; l < o; l++) {
        const o = a[l];
        if (o.id === e) return n ? o : o[t];
    }
}
function setAlarmObjectProperty(e, t, n, a = !1) {
    const o = [],
        l = JSON.parse(localStorage.getItem("allAlarmSavedList")),
        i = l.length;
    for (let r = 0; r < i; r++) {
        const i = l[r];
        null !== i && i.id === e ? ((i[t] = n), a && ((i.isRunningSetTimeout = !1), (i.isDoneRingingOrStarted = !1), (i.isTurnedOn = !0)), o.push(i)) : o.push(i);
    }
    localStorage.setItem("allAlarmSavedList", JSON.stringify(o));
}
function setAllPastTimeCorrected() {
    if (0 !== JSON.parse(localStorage.getItem("allAlarmSavedList")).length) {
        const e = !!JSON.parse(localStorage.getItem("setting")).automaticallyDeleleRingedAlarms,
            t = JSON.parse(localStorage.allAlarmSavedList),
            n = t.length,
            a = [],
            o = new Date().getTime();
        for (let l = 0; l < n; l++) {
            const n = t[l];
            new Date(n.datetime).getTime() > o ? a.push(n) : e || ((n.isDoneRingingOrStarted = !0), (n.isRunningSetTimeout = !1), a.push(n));
        }
        return localStorage.setItem("allAlarmSavedList", JSON.stringify(a)), a;
    }
    a = nullHandleForThisLocalStorageProperty("allAlarmSavedList", []);
}
function editButtonClearifyAzan() {
    const e = JSON.parse(localStorage.getItem("allAlarmSavedList")),
        t = e.length;
    for (let n = 0; n < t; n++) {
        const t = e[n];
        t.isItForAzan && new Date(t.datetime).getTime() < new Date().getTime() && document.getElementById(t.id).firstElementChild.firstElementChild.setAttribute("disabled", !0);
    }
}
function correctIsRunnningSetTimeoutPropertyOfAllUnringed() {
    const e = [];
    toSave = removeNullsFromThisList(JSON.parse(localStorage.getItem("allAlarmSavedList")));
    const t = new Date().getTime();
    for (let n = 0; n < toSave.length; n++) {
        const a = toSave[n];
        new Date(a.datetime).getTime() > t && !a.isDoneRingingOrStarted && (a.isRunningSetTimeout = !1), e.push(a);
    }
    localStorage.setItem("allAlarmSavedList", JSON.stringify(e));
}
function tackle(e = !0) {
    tcle.forEach(function (t) {
        e ? t.removeAttribute("disabled") : t.setAttribute("disabled", !0);
    });
}
function closeToneAndCorrectionAfterToneEnding(e) {
    try {
        e.parentElement.parentElement.parentElement.remove();
    } catch (e) { }
    tackle(!0), (azanAudio.currentTime = 0), azanAudio.pause(), (alarmAudio.currentTime = 0), alarmAudio.pause();
}
function toggleMuteAzanAudio(e) {
    azanAudio.muted ? ((azanAudio.muted = !1), (e.innerText = "Mute")) : ((azanAudio.muted = !0), (e.innerText = "Unmute"));
}
function sideCollapseDisplayAudio(e = !1) {
    const t = $("#audioRingingDisplay"),
        n = $("#firstOfRingingDisplay");
    e ? ($(".toHideOnSideCollapse").removeClass("none"), $(".toShowOnSideCollapse").addClass("none")) : (t.css({ height: "200px" }), $(".toHideOnSideCollapse").addClass("none"), $(".toShowOnSideCollapse").removeClass("none")),
        t.toggleClass("leftSlide"),
        n.toggleClass("widthSetAlarmAudioDisplay");
}
function correctAfterToneEnding() {
    try {
        (runningAudio = !1), $(".tackle").removeAttr("disabled");
        const e = document.getElementById("audioRingingDisplay");
        null != e && e.remove();
    } catch (e) { }
}
function displayAudioRinging(e = !0, t = "No Title", n = 18e4) {
    !0 === e ? alarmAudio.play() : azanAudio.play(), tackle(!1);
    const a = new Date();
    if (null === document.getElementById("audioRingingDisplay")) {
        const n = document.createElement("div");
        (n.innerHTML = `\n    <div class="fixed position-fixed fixed-center-custom" style="background:transparent!important;" id="audioRingingDisplay">\n    <div class="card text-center shadow-lg" id="firstOfRingingDisplay">\n        <div class="toHideOnSideCollapse card-header d-flex justify-content-between">\n            <h5 class="toHideOnSideCollapse">${t}</h5>\n            <button class="btn btn-close" onclick="closeToneAndCorrectionAfterToneEnding(this),correctAfterToneEnding()"></button>\n        </div>\n        <div class="toHideOnSideCollapse card-body">\n            <h1><span class="badge px-4 py-2 m-hide text-bg-info mx-3 getCurrentTimeClass">${a.toLocaleString(
            void 0,
            { timeStyle: "short" }
        )}</span></h1>\n            <h2><span class="badge px-4 py-2 m-hide text-bg-info mx-3 getCurrentTimeClass">${a.toLocaleString(void 0, { dateStyle: "medium" })}</span></h2>\n            <button class="btn btn-danger" ${!0 === e ? 'onclick="closeToneAndCorrectionAfterToneEnding(this)">Stop' : 'onclick="toggleMuteAzanAudio(this)">Mute'
            }</button>\n        </div>\n        <div class="card-footer d-flex justify-content-between">\n            <h5 class="toHideOnSideCollapse">${!0 === e ? "Alarm Ringing" : "Azan | Adhan voice"
            } ...</h5>\n            <div class="p-1"><i onclick="sideCollapseDisplayAudio()" class="bi bi-chevron-right toHideOnSideCollapse" style="font-size:1.3rem;"></i></div>\n            <div class="p-1" style="transform: translate(-15px, 0px)!important;"><i onclick="sideCollapseDisplayAudio(true)" class="bi bi-chevron-left toShowOnSideCollapse none" style="font-size:1.3rem;"></i></div>\n        </div>\n    </div>\n    </div>\n        `),
            document.body.appendChild(n);
    }
    try {
        setTimeout(() => {
            closeToneAndCorrectionAfterToneEnding(), correctAfterToneEnding();
        }, n);
    } catch (e) { }
}
function removeAllAzanObjsFromLocalStorage() {
    const e = [],
        t = JSON.parse(localStorage.getItem("allAlarmSavedList")),
        n = t.length;
    for (let a = 0; a < n; a++) {
        const n = t[a];
        null === n || n.isItForAzan || e.push(n);
    }
    localStorage.setItem("allAlarmSavedList", JSON.stringify(e));
}
function checkAndRingAlarm() {
    clearAllTimeouts();
    const e = new Date().getTime();
    (toSave = removeNullsFromThisList(toSave)).forEach(function (t) {
        const n = new Date(t.datetime).getTime(),
            a = t.title,
            o = t.id;
        n > e &&
            n - e > 2e3 &&
            t.isTurnedOn &&
            !t.isRunningSetTimeout &&
            n - e < 2592e5 &&
            (setAlarmObjectProperty(o, "isRunningSetTimeout", !0),
                setTimeout(() => {
                    if (getAlarmObjectPropertyValueById(o, "isTurnedOn") && !getAlarmObjectPropertyValueById(o, "isRunningSetTimeout")) {
                        if ((setAlarmObjectProperty(o, "isRunningSetTimeout", !1), (runningAudio = !0), getAlarmObjectPropertyValueById(o, "isItForAzan"))) {
                            azanAudio.src = JSON.parse(localStorage.getItem("defaultAzanTone")).src;
                            const e = 0 === JSON.parse(localStorage.getItem("defaultAzanTone")).nthNumberSelected ? 247500 : 152500;
                            displayAudioRinging(!1, a, e);
                        } else (alarmAudio.src = JSON.parse(localStorage.getItem("defaultAlarmTone")).src), displayAudioRinging(!0, a);
                        setAlarmObjectProperty(o, "isTurnedOn", !1), setAlarmObjectProperty(o, "isDoneRingingOrStarted", !0);
                    }
                    showAlarmList(!0, !1, !1, !0), btnsClearify();
                }, n - e)),
            n < e && t.isTurnedOn && setAlarmObjectProperty(o, "isTurnedOn", !1);
    });
}
function sortForGrouping(e) {
    return e.sort(function (e, t) {
        return parseInt(e.id.replace("id", "")) - parseInt(t.id.replace("id", ""));
    });
}
function editObject(e) {
    const t = document.getElementById("editDiv");
    null !== t && t.remove();
    const n = e.id,
        a = getAlarmObjectPropertyValueById(n, "", !0),
        o = !!a.isItForAzan,
        l = a.title,
        i = a.realTime,
        r = new Date(a.datetime),
        s = document.createElement("div");
    (s.id = "editDiv"),
        (s.innerHTML = `\n    <div class="card-body">\n    <div class="flex-center">\n        <h5 class="card-title my-3 text-center">${o ? "Customize Today's Azan Time" : "Edit Alarm"
            }</h5>\n        <button class="btn btn-close" id="cancelEdit"></button>\n    </div>\n    <hr>\n    <h5 class="p-title my-2 text-center">${o ? "Azan's" : "Alarm's"
            } Info</h5>\n    <div class="prevInfo">\n    <h6 class="mb-2 text-muted">${o ? "For " : "Title"} : ${l}</h6>\n    ${o ? `<h6 class="mb-2 text-muted">Real Time Start : ${new Date(i).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" })}</h6>` : ""
            }\n    <h6 class="mb-2 text-muted">Datetime : ${r.toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" })}</h6>\n    </div>\n    <hr>\n    ${o ? "" : '<h6 class="card-subtitle mb-2">Edit note title if you want</h6>\n    <input id="notesAlarmInputEdit" type="text" class="mb-3 w-50 form-control"\n    placeholder="Something.."></input>'
            }\n\n    <h6 class="card-subtitle mb-2">Edit the date and time</h6>\n    <input id="alarmInputEdit" type="datetime-local" class="mb-3 w-50 form-control"></input>\n    <br>\n    <button disabled id="setAlarmEdit" class="btn btn-primary">Save Changes</button>\n    </div>\n\n    `),
        document.body.appendChild(s);
    const c = document.getElementById("notesAlarmInputEdit"),
        d = document.getElementById("alarmInputEdit"),
        m = document.getElementById("setAlarmEdit"),
        u = document.getElementById("cancelEdit"),
        g = r.getTime();
    let h = !1,
        p = !1;
    o ||
        c.addEventListener("input", function () {
            const e = this.value;
            e !== l && "" !== e ? ((h = !0), m.removeAttribute("disabled")) : m.setAttribute("disabled", !0);
        }),
        d.addEventListener("input", function () {
            const e = new Date(this.value).getTime();
            e !== g ? (o ? (e > i && e < a.endMax ? ((p = !0), m.removeAttribute("disabled")) : m.setAttribute("disabled", !0)) : o || ((p = !0), m.removeAttribute("disabled"))) : m.setAttribute("disabled", !0);
        }),
        m.addEventListener("click", function () {
            h && setAlarmObjectProperty(n, "title", c.value),
                p && setAlarmObjectProperty(n, "datetime", d.value, !0),
                (h || p) && toReload(),
                o ? (showAlarmList(!0), showAlarmList(!0, !1, !1, !0)) : (showAlarmList(!0, !1, !1, !0), showAlarmList(!0)),
                checkAndRingAlarm(),
                s.remove();
        }),
        u.addEventListener("click", function () {
            s.remove();
        });
}
function showAlarmList(e = !1, t = !1, n, a = !1) {
    const o = filteringBox.innerText,
        l = new Date();
    let i;
    nullHandleForThisLocalStorageProperty("allAlarmSavedList"),
        JSON.parse(localStorage.getItem("allAlarmSavedList")).length > 0 && !1 === e && checkAndRingAlarm(),
        (setAlarmList.innerHTML = ""),
        (azanBox.innerHTML = ""),
        (toSave = removeNullsFromThisList(toSave)),
        localStorage.setItem("allAlarmSavedList", JSON.stringify(toSave)),
        (toSave = setAllPastTimeCorrected());
    let r = 0,
        s = !1;
    if (((i = toSave), void 0 !== toSave)) {
        "Oldest First" === o || ("Latest First" === o ? (list = toSave.reverse()) : ((s = !0), (list = sortForGrouping(list))));
        let e = -1;
        if (
            (i.forEach(function (t, o) {
                if (t.isItForAzan) {
                    if (a) {
                        const e = new Date(t.datetime),
                            a = t.id,
                            l = !!t.isTurnedOn,
                            i = document.createElement("div");
                        (i.className = "accordion-item border azanAccordionItem"),
                            (i.innerHTML = `\n            <h2 class="px-4 accordion-button alarmBoxPieces" data-bs-target="#${a}" data-bs-toggle="collapse">${t.title
                                }\n            <span class="mx-4 badge text-bg-success m-hide">${e.toLocaleString(void 0, { timeStyle: "short" })}</span>\n            <span class="mx-4 badge text-bg-${l ? "success" : "secondary"} m-px">${l ? "On" : "Off"
                                }</span>\n            </h2>\n            </div>\n            <div class="az accordion-collapse ${n === a || collapseIds.includes(a) ? "show" : ""
                                } collapse alarmBoxPieces" id="${a}">\n            <div class="accordion-body position-relative azanAccordionBody">\n            <button id="editAzan" onclick="editObject(this.parentElement.parentElement)" class="btn btn-secondary  btn-sm mt-3 float-right position-absolute end-0 top-0 my-1" title="Customize">Customize timing</button>\n            <p><b>Date and time :</b> ${e.toLocaleString(
                                    void 0,
                                    { dateStyle: "long", timeStyle: "short" }
                                )}</p>\n            <div class="form-check form-switch">\n            <input title="Turn on or off this alarm" class="turnOnOrOff form-check-input switches" type="checkbox" role="switch" id="flexSwitchCheckDefault${o}" ${l ? "checked" : ""
                                } ${t.isDoneRingingOrStarted ? "disabled" : ""
                                }>\n            <label class="form-check-label" for="flexSwitchCheckDefault${o}" style="user-select:none;" title="Turn on or off this alarm">Azan on</label>\n            </div>\n             </div>\n            `),
                            azanBox.appendChild(i);
                    }
                } else {
                    e++, r++;
                    const a = new Date(t.datetime),
                        o = t.id,
                        i = !!t.isTurnedOn,
                        c = document.createElement("div");
                    (c.className = "accordion-item"),
                        0 === e && (c.id = "latestOneAlarm"),
                        (c.innerHTML = `\n            ${s ? getGroupingResult(l, a) : ""}\n\n            <h2 class="accordion-button alarmBoxPieces" data-bs-target="#${o}" data-bs-toggle="collapse">${e + 1}. ${t.title
                            }\n            <span class="mx-4 badge text-bg-success m-hide">${a.toLocaleString(void 0, { timeStyle: "short" })}</span>\n            <span class="mx-4 badge text-bg-success m-hide">${a.toLocaleString(void 0, {
                                dateStyle: "medium",
                            })}</span>\n            <span class="mx-4 badge text-bg-${i ? "success" : "secondary"} m-px">${i ? "On" : "Off"}</span>\n            </h2>\n            </div>\n            <div class="accordion-collapse ${n === o || collapseIds.includes(o) ? "show" : ""
                            } collapse alarmBoxPieces" id="${o}">\n            <div class="accordion-body position-relative">\n            <div class="position-absolute end-0">\n            </div>\n            <p><b>Date and time :</b> ${a.toLocaleString(
                                void 0,
                                { dateStyle: "long", timeStyle: "short" }
                            )}</p>\n            <div class="form-check form-switch">\n            <input title="Turn on or off this alarm" class="turnOnOrOff form-check-input switches" type="checkbox" role="switch" id="flexSwitchCheckDefault${e}" ${i ? "checked" : ""
                            } ${t.isDoneRingingOrStarted ? "disabled" : ""
                            }>\n            <label class="form-check-label" for="flexSwitchCheckDefault${e}" style="user-select:none;" title="Turn on or off this alarm">Alarm on</label>\n            </div>\n            <div class="position-relative">\n            <button id="setTomorrowBtn${o}" class="btn btn-sm btn-secondary mt-3 position-absolute start-0" title="Set alarm for next day at this time" onclick="setAlarm(getDateObjectOfNextDayIfInFuture('${a}'),'${t.title
                            }')">Set For Next Day</button>\n            <button id="deleteBtnAlarm${e}" class="btn btn-danger  btn-sm mt-3 deleteAlarm float-right position-absolute end-0" title="Delete this alarm" onclick="hideIt(this);deleteAlarm(this)">Delete alarm</button>\n            <button id="editAlarm" onclick="editObject(this.parentElement.parentElement.parentElement)" class="btn btn-secondary  btn-sm mt-3 float-right position-absolute start-50" title="Edit This Alarm">Edit Alarm</button>\n            </div>\n            </div>\n            `),
                        setAlarmList.appendChild(c);
                }
            }),
                a && editButtonClearifyAzan(),
                t)
        ) {
            const e = $("#latestOneAlarm");
            e.attr("style", "display:none;"), e.show(300);
        }
        $(".turnOnOrOff").each(function () {
            const e = this,
                t = $(e);
            $(t).click(function () {
                const t = this.offsetHeight - this.clientHeight;
                sessionStorage.setItem("s", JSON.stringify(t));
                const n = e.parentElement.parentElement.parentElement.id;
                !0 === getAlarmObjectPropertyValueById(n, "isTurnedOn")
                    ? (setAlarmObjectProperty(n, "isTurnedOn", !1),
                        setTimeout(() => {
                            if ((showAlarmList(), showAlarmList(!0, !1, n, !0), !1 === getAlarmObjectPropertyValueById(n, "isItForAzan"))) {
                                doScroll(JSON.parse(sessionStorage.s));
                            }
                        }, 60))
                    : (setAlarmObjectProperty(n, "isTurnedOn", !0),
                        setTimeout(() => {
                            if ((showAlarmList(), showAlarmList(!0, !1, n, !0), !1 === getAlarmObjectPropertyValueById(n, "isItForAzan"))) {
                                doScroll(JSON.parse(sessionStorage.getItem("s")));
                            }
                        }, 60));
            });
        }),
            $(".accordion-item").each(function () {
                $(this).click(function () {
                    try {
                        const e = this.nextElementSbling.id;
                        collapseIds.includes(e)
                            ? (collapseIds = collapseIds.filter(function (t) {
                                return t !== e;
                            }))
                            : collapseIds.push(e);
                    } catch (e) { }
                });
            }),
            Array.from(document.getElementsByClassName("expandOrCollapseItems")).forEach(function (e) {
                e.addEventListener("click", function () {
                    this.classList.toggle("bi-arrows-angle-expand"), collapseTillNext(this);
                });
            });
    }
    (totalAlarm.innerText = r), showMsgIfNoAlarm(), sortBeutify();
}
function doScroll(e) {
    window.scrollBy(0, e);
}
function setAlarm(e, t) {
    let n = !1;
    if (t.length > 60) return showAlert("alarm title should short", 3e3, !1);
    const a = JSON.parse(localStorage.getItem("allAlarmSavedList")),
        o = a.length;
    for (let t = 0; t < o; t++) {
        const o = a[t];
        if (parseInt(new Date(o.datetime).getTime() / 6e4) === parseInt(new Date(e).getTime() / 6e4)) {
            n = !0;
            break;
        }
    }
    if (!n && JSON.parse(localStorage.allAlarmSavedList).length < 50) {
        let n = t;
        (e = getDateTimeLocalToDateObj(e)), (toSave = []);
        const a = new Date().getTime();
        if (e.getTime() >= a + 4e3) {
            const t = showAlert("Alarm has been set for ", 3e3, !0, `${e.toLocaleString()}`);
            addInLocalStorage(n, e),
                showAlarmList(!1, !0),
                btnsClearify(),
                setTimeout(() => {
                    const e = document.getElementById(t);
                    null !== e && e.remove();
                }, 3e3);
        } else showAlert("alarm must be a time of future", 3e3, !1);
    } else showAlert(n ? "You already  have set an alarm at this time" : "Maximum 50 alarm could be set or store, please delete some to add more", 4e3, !1);
}
function resetPage() {
    confirm("Are you sure you want to reset this page") && (localStorage.clear(), location.reload());
}
function localStorageSettingObj() {
    return JSON.parse(localStorage.getItem("setting"));
}
function ringedAlarmDeleteOnOrOff(e) {
    const t = localStorageSettingObj();
    e.checked ? (t.automaticallyDeleleRingedAlarms = !0) : (t.automaticallyDeleleRingedAlarms = !1), localStorage.setItem("setting", JSON.stringify(t));
}
function hideIt(e) {
    $(e).parent().parent().parent().hide(310), $(e).parent().parent().parent().prev().hide(310);
}
function deleteAlarm(e) {
    const t = e.parentElement.parentElement.parentElement.id;
    setTimeout(() => {
        deleteAlarmFromLocalStorage(t);
    }, 300);
}
function correctionOfStorageSizeRelated() {
    const e = getLocalStorageSizeInKB(!0).toFixed(2),
        t = getLocalStorageSizeInKB().toFixed(2);
    $(".storageFullNowPercentage").each(function () {
        $(this).text(t + "KB"), $(this).attr("aria-valuenow", e), $(this).attr("style", `width:${e}%;`);
    }),
        $(".storageFullNowValue").text(t),
        $(".storageFullNowValueRemaining").text(5120 - t);
}
function setModeOfTheme(e, t) {
    "bg-dark" === e
        ? ($(".mode-changable-dark").addClass("bg-dark"),
            $(".mode-changable-light").addClass("bg-light"),
            $(".btn-primary").addClass("white"),
            $(".btn-primary").addClass("bg-dark"),
            $('input[type="search"]').addClass("bg-light"),
            $(".rm-bg-info").removeClass("bg-info"))
        : ($(".mode-changable-dark").removeClass("bg-dark"),
            $(".mode-changable-light").removeClass("bg-light"),
            $(".btn-primary").removeClass("white"),
            $(".btn-primary").removeClass("bg-dark"),
            $('input[type="search"]').removeClass("bg-light"),
            $(".rm-bg-info").addClass("bg-info"));
    let n = $("#settingSelectMode").children();
    n.attr("selected", !1), $(n[t]).attr("selected", !0);
}
function getUserGeoLocation() {
    fetch("https://api.bigdatacloud.net/data/reverse-geocode-client")
        .then(function (e) {
            return e.json();
        })
        .then(function (e) {
            let t,
                n,
                a = "" === e.countryCode ? "BD" : e.countryCode;
            (t = "" !== e.city ? e.city : "" !== e.locality ? e.locality : "Sylhet"),
                countryOptions.removeAttr("selected"),
                (cty.value = t),
                countryOptions.each(function (e) {
                    if (this.value === a) return (n = e), void this.setAttribute("selected", !0);
                }),
                localStorage.setItem("userInfo", JSON.stringify({ selectedIndex: n, countryCode: a, city: t }));
            let o = JSON.parse(localStorage.getItem("userInfo"));
            sendRequestForAzan(o.selectedIndex, o.countryCode, o.city, !0);
        })
        .catch(function () { });
}
function sendRequestForAzan(e = 0, t, n, a = !1) {
    if (
        ((tbody.innerHTML = '\n    <div class="flex-center spinner">\n    <div class="spinner-grow" role="status">\n        <span class="visually-hidden">Loading...</span>\n    </div>\n</div>\n    '),
            (tbody2.innerHTML = '\n    <div class="flex-center spinner">\n    <div class="spinner-grow" role="status">\n        <span class="visually-hidden">Loading...</span>\n    </div>\n</div>\n    '),
            $(".spinner").show(),
            null !== JSON.parse(localStorage.getItem("aboutAzan")) && !a)
    )
        return;
    const o = new Date(),
        l = new URL(`https://api.aladhan.com/v1/calendarByCity?city=${n}&country=${t}&month=${o.getMonth() + 1}&year=${o.getFullYear()}&method=3`);
    fetch(l)
        .then(function (e) {
            return e.json();
        })
        .then(function (t) {
            "OK" !== t.status
                ? (localStorage.removeItem("aboutAzan"), localStorage.removeItem("userInfo"))
                : (localStorage.setItem("aboutAzan", JSON.stringify({ lastDataFetched: o, data: t.data })),
                    setTimeout(() => {
                        showAzanDisplay(e, n);
                    }, 0));
        })
        .catch(function () { });
}
function showAzanDisplay(e, t) {
    void 0 !== e && (countryOptions.removeAttr("selected"), $(countryOptions[e]).attr("selected", !0)), void 0 !== t && (cty.value = t);
    const n = new Date(),
        a = n.getDate(),
        o = n.toLocaleDateString(void 0, { dateStyle: "medium" }).split(" ")[0];
    function l(e, t) {
        delete e.Firstthird, delete e.Lastthird;
        let n = document.createElement("tr");
        for (prop in ((n.innerHTML += `<th>${t}</th>`), e)) {
            const t = fmt(e[prop]);
            n.innerHTML += `<td>${t}</td>`;
        }
        return n;
    }
    try {
        const e = JSON.parse(localStorage.getItem("aboutAzan")).data,
            i = e.length,
            r = e[n.getDate() - 1],
            s = r.timings;
        tbody.appendChild(l(r.timings, r.date.readable)),
            delete s.Sunrise,
            delete s.Sunset,
            delete s.Imsak,
            delete s.Midnight,
            delete s.Firstthird,
            delete s.Lastthird,
            localStorage.setItem("todayTimings", JSON.stringify(s)),
            localStorage.setItem("fetchedLastTime", JSON.stringify(new Date().getTime()));
        let c = 0;
        for (let t = 0; t < i; t++) {
            const n = e[t],
                o = n.date.readable;
            parseInt(o.split(" ")[0]) > a && (tbody2.appendChild(l(n.timings, o)), c++);
        }
        0 === c && $(".tab2").remove(),
            $(".todayDate").text(n.toLocaleDateString(void 0, { dateStyle: "medium" })),
            $(".todayMonth").text(o),
            $(".spinner").hide(),
            $("#cityOf").text(t),
            $("#showAccordingToCity").text(JSON.parse(localStorage.getItem("userInfo")).city),
            removeAllAzanObjsFromLocalStorage(),
            (function () {
                const e = ["Isha", "Magrib", "Asar", "Dhuhor", "Fajr"];
                let t = [72e5, 6e5, 21e5, 36e5, 3e6];
                const n = Object.values(JSON.parse(localStorage.getItem("todayTimings"))).reverse(),
                    a = n.length,
                    o = JSON.parse(localStorage.getItem("autoTurnOnAzan")),
                    l = JSON.parse(localStorage.getItem("isEndMaxDone"));
                for (let i = 0; i < a; i++) {
                    const a = convToTody(n[i]);
                    a.setTime(a.getTime() + i),
                        !0 === o
                            ? !0 === l
                                ? addInLocalStorage(e[i], new Date(a), !1, !0)
                                : addInLocalStorage(e[i], new Date(a), !1, !0, a.getTime() + t[i], a.getTime())
                            : !0 === l
                                ? addInLocalStorage(e[i], new Date(a), !1, !1)
                                : addInLocalStorage(e[i], new Date(a), !1, !1, a.getTime() + t[i], a.getTime());
                }
                null === l && localStorage.setItem("isEndMaxDone", JSON.stringify(!0));
            })(),
            showAlarmList(!1, !1, !1, !0);
    } catch (e) { }
}
function convToTody(e) {
    const t = new Date(),
        n = (e = e.split(" ")[0].split(":"))[0],
        a = e[1];
    return t.setHours(parseInt(n), parseInt(a), 0), t;
}
function setAutoTurnOnAzanOnOrOff(e) {
    e.checked ? localStorage.setItem("autoTurnOnAzan", JSON.stringify(!0)) : localStorage.setItem("autoTurnOnAzan", JSON.stringify(!1)), removeAzanObjectsFromSaved(), toReload();
}
function toReload() {
    location.reload();
}
setAlarmBtn.addEventListener("click", function () {
    setAlarm(alarmInput.value, noteAlarmInput.value);
}),
    $(window).on("load", function () {
        correctIsRunnningSetTimeoutPropertyOfAllUnringed(), btnsClearify(), (dnShowing = !0);
        let e = JSON.parse(localStorage.getItem("mode"));
        setModeOfTheme(e.modeClassName, e.modeSelectedIndex),
            correctionOfStorageSizeRelated(),
            $(".pagesBtn").each(function () {
                $(this).click(function () {
                    $(".pagesBtn").removeClass("border2px"), $(this).addClass("border2px");
                });
            }),
            removeUnknownLocalStorageProperties(),
            JSON.parse(localStorage.getItem("setting")).automaticallyDeleleRingedAlarms ? $("#deleteRingedAlarm").attr("checked", !0) : $("#deleteRingedAlarm").removeAttr("checked");
    }),
    jQuery(document).ready(function (e) {
        let t = JSON.parse(localStorage.getItem("dontShowAgain"));
        function n() {
            const t = JSON.parse(localStorage.getItem("defaultAzanTone")),
                n = JSON.parse(localStorage.getItem("defaultAlarmTone")),
                a = e("#settingSelectRingtoneAzan"),
                o = e("#settingSelectRingtoneAlarm");
            a.removeAttr("selected"), o.removeAttr("selected"), e(a.children()[t.nthNumberSelected]).attr("selected", !0), e(o.children()[n.nthNumberSelected]).attr("selected", !0);
        }
        e(".mobileDetectedOk").click(function () {
            location = "https://www.google.com/";
        }),
            fetch("https://api.bigdatacloud.net/data/client-info")
                .then(function (e) {
                    return e.json();
                })
                .then(function (n) {
                    1 == n.isMobile ? ((mb = !0), e("#mobileDetected").modal("show"), localStorage.clear(), clearAllTimeouts()) : null === t && e("#askForPermissionToPlayAudioPrompt").modal("show");
                })
                .catch(function () {
                    null === t && e("#askForPermissionToPlayAudioPrompt").modal("show");
                }),
            e('input[role="switch"],.turnOnOrOff').each(function () {
                (this.style.userSelect = "none"), (this.nextElementSibling.style.userSelect = "none");
            }),
            e("#cancelConfirmation").click(function () {
                e(".btn-close").click(), e("body").css({ "overflow-y": "scroll !important" });
            }),
            e("#acceptConfirmation").click(function () {
                deleteAlarmsAllFromLocalStorage();
            }),
            e(".filter-alarms").each(function () {
                e(this).click(function () {
                    this.classList.add("none"),
                        "Grouping" === this.id
                            ? (this.previousElementSibling.previousElementSibling.classList.toggle("none"), (filteringBox.innerText = "Latest First"), showAlarmList(!0))
                            : (this.nextElementSibling.classList.toggle("none"), (filteringBox.innerText = this.nextElementSibling.id.replace("-", " ")), showAlarmList(!0));
                });
            }),
            e("#setting").click(function () {
                e("#settingPage").show(500);
            }),
            e("#settingSelectMode").on("change", function () {
                let t = this.selectedIndex,
                    n = e(this).children()[t].value;
                (obj = { modeClassName: n, modeSelectedIndex: t }), localStorage.setItem("mode", JSON.stringify(obj)), setModeOfTheme(n, t);
            }),
            e("#copyDataLocalStorage").click(function () {
                navigator.clipboard.writeText(JSON.stringify(localStorage)),
                    e(this).text("Copied"),
                    setTimeout(() => {
                        e(this).text("Copy Data");
                    }, 3e3);
            }),
            e("#importDataText").on("input", function () {
                !(function (e) {
                    try {
                        const t = JSON.parse(e);
                        return !!(Array.isArray(JSON.parse(t.allAlarmSavedList)) && isObLnN(t.defaultAlarmTone, 2) && isObLnN(t.defaultAzanTone, 2) && isObLnN(t.mode, 2) && isObLnN(t.setting, 1));
                    } catch (e) {
                        return !1;
                    }
                })(this.value)
                    ? (this.classList.add("bred"), this.classList.remove("blime"))
                    : (this.classList.remove("bred"), this.classList.add("blime"));
            }),
            e("#saveDataSection").click(function () {
                try {
                    const e = JSON.parse(this.previousElementSibling.value);
                    for (const [t, n] of Object.entries(e)) localStorage.setItem(t, n);
                    location.reload();
                } catch (e) {
                    showAlert("sorry something went wrong while saving and set data", 3e3, !1, "", 1e5);
                }
            });
        let a = { nthNumberSelected: 0, src: "audio/Alarm0.mp3" };
        e("#settingSelectRingtoneAzan, #settingSelectRingtoneAlarm").on("change", function () {
            const e = this.selectedIndex;
            a.nthNumberSelected = e;
            const t = this.id.includes("Alarm") ? "Alarm" : "Azan",
                o = `audio/${t + e}.mp3`;
            (a.src = o), "Azan" === t ? (azanAudio.src = o) : (alarmAudio.src = o), localStorage.setItem(`default${t}Tone`, JSON.stringify(a)), n();
        }),
            n();
    }),
    !0 === JSON.parse(localStorage.getItem("autoTurnOnAzan")) ? document.getElementById("autoTurnOnAzan").setAttribute("checked", !0) : document.getElementById("autoTurnOnAzan").removeAttribute("checked"),
    jQuery(document).ready(function () {
        if (
            ($("#country, #city").on("change input", function () {
                setLocation.removeAttribute("disabled");
            }),
                Array.isArray(JSON.parse(localStorage.getItem("userInfo"))))
        )
            getUserGeoLocation();
        else {
            const e = JSON.parse(localStorage.userInfo);
            sendRequestForAzan(e.selectedIndex, e.countryCode, e.city, !0);
        }
        $("#setLocation").click(function () {
            removeAllAzanObjsFromLocalStorage();
            let e = $("#country").val(),
                t = $("#city").val();
            t = t[0].toUpperCase() + t.slice(1);
            let n = document.getElementById("country").selectedIndex;
            localStorage.setItem("userInfo", JSON.stringify({ selectedIndex: n, countryCode: e, city: t })), this.setAttribute("disabled", !0), sendRequestForAzan(n, e, t, !0);
        }),
            $("#azanBtn").click(function () {
                azanBox.innerHTML.length < 10 && showAlarmList(!1, !1, !1, !0);
            }),
            $(".toneTackle1").each(function () {
                $(this).click(function () {
                    $(".toneTackle1").removeAttr("disabled"), $(this).attr("disabled", !0);
                });
            }),
            $(".toneTackle2").each(function () {
                $(this).click(function () {
                    $(".toneTackle2").removeAttr("disabled"), $(this).attr("disabled", !0);
                });
            }),
            playAudio1.addEventListener("click", function () {
                azanAudio.play();
            }),
            pauseAudio1.addEventListener("click", function () {
                azanAudio.pause();
            }),
            stopAudio1.addEventListener("click", function () {
                azanAudio.pause(), (azanAudio.currentTime = 0);
            }),
            playAudio2.addEventListener("click", function () {
                alarmAudio.play();
            }),
            pauseAudio2.addEventListener("click", function () {
                alarmAudio.pause();
            }),
            stopAudio2.addEventListener("click", function () {
                alarmAudio.pause(), (alarmAudio.currentTime = 0);
            }),
            $("#allowAudioSound").click(function () {
                document.getElementById("dontShowAgain").checked && localStorage.setItem("dontShowAgain", JSON.stringify(!0));
            });
    }),
    setTimeout(() => {
        toReload();
    }, 2592e5);

import masjid_fajr from "public/masjid-fajr.png";
import masjid_sunrise from "public/masjid-sunrise.png";
import masjid_zuhr from "public/masjid-zuhr.png";
import masjid_asr from "public/masjid-asr.png";
import masjid_magrib from "public/masjid-magrib.png";
import masjid_ishaa from "public/masjid-ishaa.png";
import tongIcon from "public/fajr.png";
import quyoshIcon from "public/dhuha.png";
import peshinIcon from "public/zuhr.png";
import asrIcon from "public/asr.png";
import shomIcon from "public/magrib.png";
import xuftonIcon from "public/isha.png";

const fajr = { name: "bomdod", icon: tongIcon };
const sunrise = { name: "quyosh", icon: quyoshIcon };
const zuhr = { name: "peshin", icon: peshinIcon };
const asr = { name: "asr", icon: asrIcon };
const magrib = { name: "shom", icon: shomIcon };
const ishaa = { name: "xufton", icon: xuftonIcon };

export default {
  prayerBgImgs: [
    masjid_fajr,
    masjid_sunrise,
    masjid_zuhr,
    masjid_asr,
    masjid_magrib,
    masjid_ishaa,
  ],
  prayerTimesIcons: [fajr, sunrise, zuhr, asr, magrib, ishaa],
};

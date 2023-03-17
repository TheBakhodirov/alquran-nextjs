import Image from "next/image";
import style from "styles/Navbar.module.scss";
import logo from "public/kaaba.png";
import { BsMoonStarsFill } from "react-icons/bs";
import { FiArrowLeft } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "@/store/themeSlice";
import { RootState } from "@/store";
import { useRouter } from "next/router";
import { Select, Tooltip } from "antd";
import Link from "next/link";
import { regions } from "@/constants";
import { changeRegion } from "@/store/prayerSlice";
import { MouseEventHandler, useRef } from "react";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

  const handleToggleTheme = () => dispatch(toggleTheme());

  const onSelectChange = (value: String) => dispatch(changeRegion(value));

  return (
    <div className={mode === "light" ? style.light : style.dark}>
      <Link href={"/"}>
        <div className={style.logo}>
          <Image src={logo} alt="Kaaba" width={40} />
          <p>Al Quran</p>
        </div>
      </Link>
      <div className={style.controls}>
        {router.route === "/prayers" && (
          <Select
            defaultValue="Toshkent"
            onChange={onSelectChange}
            className={style.select}
            options={regions}
            style={{ minWidth: "100px" }}
          />
        )}
        <button onClick={handleToggleTheme}>
          <BsMoonStarsFill />
        </button>
        {router.route !== "/" && (
          <button onClick={() => router.back()}>
            <FiArrowLeft />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;

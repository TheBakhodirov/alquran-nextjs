import Image from "next/image";
import style from "styles/Navbar.module.scss";
import logo from "public/kaaba.png";
import { BsMoonStarsFill } from "react-icons/bs";
import { FiArrowLeft } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "@/store/themeSlice";
import { RootState } from "@/store";
import { useRouter } from "next/router";
import { Tooltip } from "antd";
import Link from "next/link";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.themeReducer.mode);

  const handleToggleTheme = () => dispatch(toggleTheme());

  return (
    <div className={mode === "light" ? style.light : style.dark}>
      <Link href={"/"}>
        <div className={style.logo}>
          <Image src={logo} alt="Kaaba" width={40} />
          <p>Al Quran</p>
        </div>
      </Link>
      <div className={style.controls}>
        <Tooltip title="Toggle theme" placement="bottom">
          <button onClick={handleToggleTheme}>
            <BsMoonStarsFill />
          </button>
        </Tooltip>
        {router.route !== "/" && (
          <Tooltip title="Go back" placement="bottom">
            <button onClick={() => router.back()}>
              <FiArrowLeft />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default Navbar;

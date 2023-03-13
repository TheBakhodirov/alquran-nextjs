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

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

  const handleToggleTheme = () => dispatch(toggleTheme());

  const onSelectChange = (value: String) => dispatch(changeRegion(value));
  const onSelectSearch = () => {};

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
            showSearch
            defaultValue="Toshkent"
            optionFilterProp="children"
            onChange={onSelectChange}
            className={style.select}
            onSearch={onSelectSearch}
            notFoundContent="No data"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={regions}
            style={{ minWidth: "100px" }}
          />
        )}
        <Tooltip title="Toggle theme" placement="bottom" mouseEnterDelay={1}>
          <button onClick={handleToggleTheme}>
            <BsMoonStarsFill />
          </button>
        </Tooltip>
        {router.route !== "/" && (
          <Tooltip title="Go back" placement="bottom" mouseEnterDelay={1}>
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

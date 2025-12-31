import { kLANG_NAME_CAPITAL } from "@/app/lib/constants";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="footer text-black dark:text-white mt-10 pb-25 sm:footer-horizontal bg-base-200 text-base-content p-10 bg-white dark:bg-[#181922]">
      <aside>
        <Image src="/verbuu-logo.webp" alt="Logo" width={50} height={50} />
        <p className="text-gray-600 dark:text-gray-400">
          <span className="text-black dark:text-white">
            <i>
              <b>Common {kLANG_NAME_CAPITAL} Words</b>
            </i>
          </span>{" "}
          is a&nbsp;
          <a
            href="https://verbuu.com/"
            className="text-blue-400 hover:underline"
          >
            Verbuu
          </a>{" "}
          project
          <br />
          Copyright © {new Date().getFullYear()} – All rights reserved
        </p>
      </aside>
      <nav>
        <h6 className="footer-title">Pages</h6>
        <a className="link link-hover" href="/browse">
          Browse Word Library
        </a>
        <a className="link link-hover" href="/learn">
          Learn
        </a>
        <a className="link link-hover" href="/signin">
          Sign in
        </a>
      </nav>
      <nav>
        <h6 className="footer-title">Company</h6>
        <a className="link link-hover" href="/about">
          About us
        </a>
        <a className="link link-hover" href="mailto:hi@skyroth.com">
          Email us
        </a>
        <a
          className="link link-hover"
          href="https://forms.gle/5Y2QAkXmtiQtgmjT8"
          target="_blank"
        >
          Complete our Survey
        </a>
      </nav>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <a className="link link-hover" href="/legal/terms">
          Terms and Conditions
        </a>
        <a className="link link-hover" href="/legal/privacy">
          Privacy policy
        </a>
        <a className="link link-hover" href="/legal/cookies">
          Cookie policy
        </a>
        <a className="link link-hover" href="/legal/gdpr">
          GDPR
        </a>
      </nav>
    </footer>
  );
};

export default Footer;

import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { FaGithub, FaInstagram } from 'react-icons/fa';

const Footer = () => {

  return (
    <footer>
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex flex-col items-center md:flex-row md:justify-between w-full">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-xs leading-5 text-gray-400 mb-2 md:mb-0">
              © {new Date().getFullYear()} GenLink. All rights
              reserved.
              <br />
              Made by Nischal Kotamraju.
            </p>
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com/nischalkotamraju"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaGithub className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/gen_linkaustin/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaInstagram className="h-5 w-5" />
            </a>
            <a
              href="mailto:genlinkaustin@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <EnvelopeIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
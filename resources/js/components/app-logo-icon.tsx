import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            className={`app-logo ${props.className || ''}`}
            width="40"
            height="42"
            viewBox="0 0 40 42"
            fill="black"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 4H20C21.1 4 22 4.9 22 6H28C29.1 6 30 6.9 30 8V34C30 35.1 29.1 36 28 36H12C10.9 36 10 35.1 10 34V8C10 6.9 10.9 6 12 6H18C18 4.9 18.9 4 20 4ZM20 8H18V6H20V8ZM14 12H26V14H14V12ZM14 16H26V18H14V16ZM14 20H22V22H14V20Z"
                fillRule="evenodd"
                clipRule="evenodd"
            />
        </svg>
    );
}

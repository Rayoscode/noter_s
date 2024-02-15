import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			...colors,
			sepia: {
				10: '#FFE0B5',
				20: '#FFE4BD',
				30: '#FFE8C8',
				40: '#FFEDD3',
				50: '#FFF1DE'
			},
			coolGray: {
				10: '#323C47',
				20: '#73889D',
				30: '#A8B5C3',
				40: '#CBD3DB',
				50: '#D0D7DE'
			},
			red: {
				primary: '#F44336',
				50: '#FFCDD2',
				100: '#E57373',
				200: '#FF8A80',
				300: '#C62828',
				400: '#D32F2F',
				500: '#B71C1C',
				600: '#A01A1A',
				700: '#891717',
				800: '#721414',
				900: '#5B1111',
				A100: '#FFD1DC',
				A200: '#FFB7B7',
				A400: '#FF9898',
				A700: '#FF7979'
			},
			blue: {
				primary: '#03A9F4',
				50: '#E3F2FD',
				100: '#BBDEFB',
				200: '#90CAF9',
				300: '#64B5F6',
				400: '#42A0F2',
				500: '#03A9F4',
				600: '#0288D1',
				700: '#0269AA',
				800: '#014C8C',
				900: '#00346D',
				A100: '#B3E5FC',
				A200: '#81D4FA',
				A400: '#4FC3F7',
				A700: '#29B6F6'
			},
			green: {
				primary: '#57CA7B',
				50: '#E8F5E9',
				100: '#f4fcf7',
				200: '#c9f0d8',
				300: '#9ee4b9',
				400: '#73d89a',
				500: '#50c878',
				600: '#3daa63',
				700: '#2e8a4f',
				800: '#206a3b',
				900: '#145027',
				A100: '#B9F6CA',
				A200: '#69F0AE',
				A400: '#40C463',
				A700: '#2E984B'
			},
			yellow: {
				primary: '#fbbc15',
				50: '#FFFDE7',
				100: '#fffdf4',
				200: '#fef2c8',
				300: '#fde69c',
				400: '#fcd970',
				500: '#fbbc15',
				600: '#e0a012',
				700: '#c3860f',
				800: '#a56c0c',
				900: '#874f09',
				A100: '#FFF9C4',
				A200: '#FFF176',
				A400: '#FFEE58',
				A700: '#FDD835'
			},
			night: {
				900: '#111111',
				800: '#232323',
				700: '#343434',
				600: '#454545',
				500: '#565656',
				400: '#888888',
				300: '#AAAAAA',
				200: '#CCCCCC',
				100: '#DDDDDD'
			}
		},
		extend: {}
	},
	plugins: []
};

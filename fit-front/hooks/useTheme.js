import { useEffect } from "react";

const useTheme = () => {
    const [theme, setTheme] = useState(
        typeof window !== 'undefined' ? localStorage.theme || 'light' : 'light'
    );

    useEffect(() => {
        if(theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return [theme, toggleTheme];
};

export default useTheme;
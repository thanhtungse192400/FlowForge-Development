import useSmoothScoll from '../../hooks/useSmoothScoll';
import Header from '../Header/Header';

export default function SmoothLayout({ children }) {

    useSmoothScoll();

    return (
        <>
            <Header />
            {children}
        </>
    );
}
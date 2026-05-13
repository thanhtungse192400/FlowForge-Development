import useSmoothScoll from '../../hooks/useSmoothScoll';
export default function SmoothLayout({ children }) {

    useSmoothScoll();

    return (
        <>

            {children}
        </>
    );
}
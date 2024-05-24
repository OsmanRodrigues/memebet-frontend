import { Link } from '@remix-run/react';

export function Header() {
    return (
        <header>
            <Link to="/">Home</Link>
            <Link to="/games">Games</Link>
        </header>
    );
}

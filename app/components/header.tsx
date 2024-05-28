import {
    Button,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle
} from '@nextui-org/react';
import { Link } from '@remix-run/react';

const routes = {
    home: { name: 'Home', route: '/' },
    games: { name: 'Games', route: '/games' }
};

export function Header() {
    return (
        <Navbar disableAnimation isBordered>
            <MenuToggler />
            <DefaultContent />
            <MobileContent />
            <Auth />
            <Menu />
        </Navbar>
    );
}

const DefaultContent = () => (
    <>
        <NavbarContent className="mobile:hidden pr-3" justify="center">
            <NavbarBrand>
                <p className="font-bold text-inherit">Memebet 🤑</p>
            </NavbarBrand>
        </NavbarContent>
    </>
);
const MobileContent = () => (
    <NavbarContent className="hidden mobile:flex gap-4" justify="center">
        <NavbarBrand>
            <p className="font-bold text-inherit">Memebet 🤑</p>
        </NavbarBrand>
        <NavbarItem>
            <Link to={routes.home.route} color="foreground">
                {routes.home.name}
            </Link>
        </NavbarItem>
        <NavbarItem isActive>
            <Link to={routes.games.route} aria-current="page" color="warning">
                {routes.games.name}
            </Link>
        </NavbarItem>
    </NavbarContent>
);
const Auth = () => (
    <NavbarContent justify="end">
        <NavbarItem>
            <Button color="warning" variant="flat">
                Login
            </Button>
        </NavbarItem>
    </NavbarContent>
);
const Menu = () => {
    const menuItems = Object.values(routes);

    return (
        <NavbarMenu>
            {menuItems.map((item, index) => (
                <NavbarMenuItem key={`${item}-${index}`}>
                    <Link
                        className="w-full"
                        color={
                            index === 2
                                ? 'warning'
                                : index === menuItems.length - 1
                                  ? 'danger'
                                  : 'foreground'
                        }
                        to={item.route}
                    >
                        {item.name}
                    </Link>
                </NavbarMenuItem>
            ))}
        </NavbarMenu>
    );
};
const MenuToggler = () => (
    <NavbarContent className="mobile:hidden" justify="start">
        <NavbarMenuToggle />
    </NavbarContent>
);

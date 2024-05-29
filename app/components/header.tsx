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
import { Link, useLocation } from '@remix-run/react';

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
const NavBarItemWithLocationFeeback = ({
    locationPathname,
    routeProps,
    index,
    menuItemsCount,
    isMobile
}: {
    locationPathname: string;
    routeProps: { name: string; route: string };
    index?: number;
    menuItemsCount?: number;
    isMobile?: boolean;
}) => {
    const Component = isMobile ? NavbarMenuItem : NavbarItem;
    const isCurrentLocation = locationPathname === routeProps.route;

    return (
        <Component isActive={isCurrentLocation}>
            <Link
                to={routeProps.route}
                aria-current={isCurrentLocation ? 'page' : undefined}
                {...{
                    className: 'w-full',
                    color:
                        isMobile && menuItemsCount
                            ? index === 2
                                ? 'warning'
                                : index === menuItemsCount - 1
                                  ? 'danger'
                                  : 'foreground'
                            : isCurrentLocation
                              ? 'warning'
                              : 'foreground'
                }}
            >
                {routeProps.name}
            </Link>
        </Component>
    );
};
const Brand = () => (
    <NavbarBrand>
        <p className="font-bold text-inherit">Memebet 🤑</p>
    </NavbarBrand>
);
const DefaultContent = () => (
    <>
        <NavbarContent className="mobile:hidden pr-3" justify="center">
            <Brand />
        </NavbarContent>
    </>
);
const MobileContent = () => {
    const location = useLocation();

    return (
        <NavbarContent className="hidden mobile:flex gap-4" justify="center">
            <Brand />
            <NavBarItemWithLocationFeeback
                locationPathname={location.pathname}
                routeProps={routes.home}
            />
            <NavBarItemWithLocationFeeback
                locationPathname={location.pathname}
                routeProps={routes.games}
            />
        </NavbarContent>
    );
};
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
    const location = useLocation();
    const menuItems = Object.values(routes);

    return (
        <NavbarMenu>
            {menuItems.map((item, index) => (
                <NavBarItemWithLocationFeeback
                    key={`${item}-${index}`}
                    locationPathname={location.pathname}
                    routeProps={item}
                    menuItemsCount={menuItems.length}
                    index={index}
                    isMobile
                />
            ))}
        </NavbarMenu>
    );
};
const MenuToggler = () => (
    <NavbarContent className="mobile:hidden" justify="start">
        <NavbarMenuToggle />
    </NavbarContent>
);

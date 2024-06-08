import { Link, useLocation, useNavigation } from '@remix-run/react';
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    Progress
} from '@nextui-org/react';
import { AuthItem } from './auth.item';

const routes = {
    home: { name: 'Home', route: '/' },
    games: { name: 'Games', route: '/games' }
};

export function Header() {
    const navigation = useNavigation();
    return (
        <>
            {navigation.state === 'loading' && (
                <Progress
                    aria-label="Loading navigation..."
                    size="sm"
                    className="w-full"
                    isIndeterminate
                />
            )}
            <Navbar isBordered>
                <MenuToggler />
                <DefaultContent />
                <MobileContent />
                <AuthItem />
                <Menu />
            </Navbar>
        </>
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
        <p className="font-bold text-inherit">
            Memebet <span>🤑</span>
        </p>
    </NavbarBrand>
);
const MobileContent = () => (
    <>
        <NavbarContent
            className="hidden mobile:flex mobile:pr-3"
            justify="center"
        >
            <Brand />
        </NavbarContent>
    </>
);
const DefaultContent = () => {
    const location = useLocation();

    return (
        <NavbarContent className="flex gap-4 mobile:hidden" justify="center">
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
    <NavbarContent className="hidden mobile:flex" justify="start">
        <NavbarMenuToggle />
    </NavbarContent>
);

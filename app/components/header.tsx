import { Link, useFetcher, useLocation, useNavigation } from '@remix-run/react';
import ethIcon from '~/assets/images/eth-icon.svg';
import {
    Avatar,
    Button,
    Chip,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    Progress
} from '@nextui-org/react';
import { useWallet } from '~/use-cases/wallet/use-wallet';
import type { WalletData } from '~/use-cases/wallet';

export const AuthFetcherKey = 'auth-fetcher';
export enum AuthFormKey {
    address = 'address'
}

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
                <Auth />
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
const Auth = () => {
    const fetcher = useFetcher<Partial<WalletData>>({
        key: AuthFetcherKey
    });
    const [wallet, dispatch] = useWallet(fetcher.data?.address, {
        onAddressChange: async newAddress => submitFormData({ newAddress }),
        onDisconnectWallet: async () => submitFormData({ action: 'logout' })
    });
    const isSubmitting = fetcher.state === 'submitting';
    const isFormDisabled =
        wallet.status === 'pending' ||
        isSubmitting ||
        fetcher.state === 'loading';

    const submitFormData = (args: {
        newAddress?: string;
        action?: 'logout';
    }) => {
        const formData = new FormData();

        if (args.action === 'logout') {
            formData.append(args.action, args.action);
        } else if (args.newAddress) {
            formData.append(AuthFormKey.address, args.newAddress);
        } else {
            return;
        }

        fetcher.submit(formData, {
            method: 'POST',
            action: '/resource/auth'
        });
    };
    const onSubmitLogin = () => {
        dispatch.connectWallet();
    };
    const onSubmitLogout = () => {
        dispatch.disconnectWallet(undefined, async () =>
            submitFormData({ action: 'logout' })
        );
    };

    return (
        <NavbarContent justify="end">
            {fetcher.data?.ethBalance && (
                <NavbarItem>
                    <Chip
                        color="warning"
                        variant="shadow"
                        avatar={<Avatar name="$" src={ethIcon} />}
                    >
                        {fetcher.data?.ethBalance}
                    </Chip>
                </NavbarItem>
            )}
            <NavbarItem>
                <fetcher.Form>
                    <Button
                        isDisabled={isFormDisabled}
                        color={isFormDisabled ? 'danger' : 'default'}
                        variant="flat"
                        onClick={
                            wallet.status === 'connected'
                                ? onSubmitLogout
                                : onSubmitLogin
                        }
                    >
                        {isSubmitting
                            ? 'Submitting...'
                            : wallet.status === 'connected'
                              ? 'Logout'
                              : 'Login'}
                    </Button>
                </fetcher.Form>
            </NavbarItem>
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

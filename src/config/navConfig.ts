import {
  Home,
  CheckCircle,
  ShoppingCart,
  Truck,
  Boxes,
  FilePlus,
  User,
  UserPlus,
} from 'lucide-react';

export const navMenuConfig = {
  admin: [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Request', href: '/admin/user-request', icon: FilePlus },
    { name: 'Purchase Request', href: '/admin/purchase-request', icon: CheckCircle },
    { name: 'Purchase Orders', href: '/admin/purchase-order', icon: ShoppingCart },
    { name: 'Suppliers', href: '/admin/supplier', icon: Truck },
    { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { name: 'Account', href: '/admin/account', icon: User },
    { name: 'Create User', href: '/admin/users/new', icon: UserPlus },
  ],
  purchasing: [
    { name: 'Dashboard', href: '/purchasing', icon: Home },
    { name: 'Purchase Request', href: '/purchasing/purchase-request', icon: CheckCircle },
    { name: 'Purchase Orders', href: '/purchasing/purchase-order', icon: ShoppingCart },
    { name: 'Suppliers', href: '/purchasing/supplier', icon: Truck },
    { name: 'Inventory', href: '/purchasing/inventory', icon: Boxes },
  ],
  warehouse: [
    { name: 'Dashboard', href: '/warehouse', icon: Home },
    { name: 'Request', href: '/warehouse/user-request', icon: FilePlus },
    { name: 'Inventory', href: '/warehouse/inventory', icon: Boxes },
  ],
};

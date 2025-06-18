import { Home, CheckCircle, ShoppingCart, Truck, Boxes, FilePlus } from 'lucide-react';

export const navMenuConfig = {
  admin: [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Approvals', href: '/admin/approvals', icon: CheckCircle },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Suppliers', href: '/admin/suppliers', icon: Truck },
    { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { name: 'Request', href: '/admin/request', icon: FilePlus },
    { name: 'Warehouse', href: '/admin/warehouse', icon: Truck },
  ],
  purchasing: [
    { name: 'Dashboard', href: '/purchasing/dashboard', icon: Home },
    { name: 'Approvals', href: '/purchasing/approvals', icon: CheckCircle },
    { name: 'Orders', href: '/purchasing/orders', icon: ShoppingCart },
    { name: 'Suppliers', href: '/purchasing/suppliers', icon: Truck },
    { name: 'Inventory', href: '/purchasing/inventory', icon: Boxes },
  ],
  warehouse: [
    { name: 'Dashboard', href: '/warehouse/dashboard', icon: Home },
    { name: 'Request', href: '/warehouse/request', icon: FilePlus },
    { name: 'Inventory', href: '/warehouse/inventory', icon: Boxes },
  ],
};

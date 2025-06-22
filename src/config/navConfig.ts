import { Home, CheckCircle, ShoppingCart, Truck, Boxes, FilePlus } from 'lucide-react';

export const navMenuConfig = {
  admin: [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Request', href: '/admin/request', icon: FilePlus },
    { name: 'Purchase Request', href: '/admin/purchasereq', icon: CheckCircle },
    { name: 'Purchase Orders', href: '/admin/purchaseord', icon: ShoppingCart },
    { name: 'Suppliers', href: '/admin/suppliers', icon: Truck },
    { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
  ],
  purchasing: [
    { name: 'Dashboard', href: '/purchasing', icon: Home },
    { name: 'Purchase Request', href: '/purchasing/purchasereq', icon: CheckCircle },
    { name: 'Purchase Orders', href: '/purchasing/purchaseord', icon: ShoppingCart },
    { name: 'Suppliers', href: '/purchasing/suppliers', icon: Truck },
    { name: 'Inventory', href: '/purchasing/inventory', icon: Boxes },
  ],
  warehouse: [
    { name: 'Dashboard', href: '/warehouse', icon: Home },
    { name: 'Request', href: '/warehouse/request', icon: FilePlus },
    { name: 'Inventory', href: '/warehouse/inventory', icon: Boxes },
  ],
};

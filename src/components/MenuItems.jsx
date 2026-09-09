import { useRouter } from "next/router";
import Link from "next/link";
import { Menu } from "antd";

function MenuItems() {
  const router = useRouter();
  const { pathname } = router;

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/">
        <Link href="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="/about">
        <Link href="/about">About</Link>
      </Menu.Item>
      <Menu.Item key="/1inch">
        <Link href="/1inch">Swap</Link>
      </Menu.Item>
      <Menu.Item key="/erc20balance">
        <Link href="/erc20balance">Balances</Link>
      </Menu.Item>
      <Menu.Item key="/erc20transfers">
        <Link href="/erc20transfers">Transactions</Link>
      </Menu.Item>
      <Menu.Item key="/nftBalance">
        <Link href="/nftBalance">NFTs</Link>
      </Menu.Item>
      <Menu.Item key="/contract">
        <Link href="/contract">Contract</Link>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;

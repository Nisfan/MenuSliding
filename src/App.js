import React, { useState } from "react";
import { Button } from "reactstrap";
import { ListGroup, ListGroupItem } from "reactstrap";
import { useTrail, a } from "react-spring";

import "./styles.css";

import "bootstrap/dist/css/bootstrap.css";

/*
  Author: Mohamed Nisfan
  email: mohnisfan@gmail.com
  CreatedAt: 11 Feb 2021
*/

const menusItems = [
  {
    label: "Menu1",
    slug: "menu1"
  },
  {
    label: "Menu2",
    slug: "menu2"
  },
  {
    label: "Menu3",
    slug: "menu3",
    children: [
      {
        label: "Menu3SubItem 1",
        slug: "menu3_subitem_1"
      }
    ]
  },
  {
    label: "Menu4",
    slug: "menu4",
    children: [
      {
        label: "Menu4SubItem 1",
        slug: "menu4_subitem_1"
      },
      {
        label: "Menu4SubItem 2",
        slug: "menu4_subitem_2"
      }
    ]
  },
  {
    label: "Menu5",
    slug: "menu5",
    children: [
      {
        label: "Menu5SubItem 1",
        slug: "menu5_subitem_1",
        children: [
          {
            label: "Menu5SubItem 1 Sub Item 1",
            slug: "menu5_subitem_1_subitem_1"
          },
          {
            label: "Menu5SubItem 1 Sub Item 12",
            slug: "menu5_subitem_1_subitem_2",
            children: [
              {
                label: "Deep level",
                slug: "deep_leve"
              }
            ]
          }
        ]
      }
    ]
  }
];

function Trail({ open, children, props }) {
  const items = React.Children.toArray(children);
  const trail = useTrail(items.length, {
    config: { mass: 5, tension: 2000, friction: 200 },
    opacity: open ? 1 : 0,
    x: open ? 0 : 20,
    height: open ? 40 : 0,
    from: { opacity: 0, x: 40, height: 0 }
  });

  return (
    <div className="trails-main" {...props}>
      <div>
        {trail.map(({ x, height, ...rest }, index) => (
          <a.div
            key={index}
            className="trails-text"
            style={{
              ...rest,
              transform: x.interpolate((x) => `translate3d(0,${x}px,0)`)
            }}
          >
            <a.div style={{ height }}>{items[index]}</a.div>
          </a.div>
        ))}
      </div>
    </div>
  );
}

const Menu = ({ menu, showSubMenu, onClickParent }) => {
  const clickEvent = (menu.onClick && menu.onClick) || showSubMenu;
  let parentClick;
  if (onClickParent && menu.children && menu.children.length) {
    parentClick = onClickParent;
  }

  return (
    <ListGroupItem
      style={{ cursor: "pointer" }}
      onClick={() => (parentClick ? parentClick(menu) : clickEvent(menu))}
    >
      {menu.label}{" "}
      {menu.children && menu.children.length && (
        <span aria-label="icon" onClick={() => clickEvent(menu)} role="img">
          ⬇️
        </span>
      )}
    </ListGroupItem>
  );
};

export default function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("");

  const [menus, setMenus] = useState(menusItems);
  const toggleMenu = () => {
    if (!showMenu) setMenus(menusItems);
    setShowMenu((p) => !p);
  };

  const showSubMenu = (menu) => {
    setSelectedMenu(menu.slug);

    if (menu.children) {
      const backButton = {
        label: "Back",
        slug: "back",
        onClick: () => {
          setMenus(menus);
        }
      };
      const children = [backButton, ...menu.children];
      setMenus(children);
    }
  };

  const onClickParent = (menu) => {
    setSelectedMenu(menu.slug);
  };

  return (
    <div className="App">
      <Button color="primary" onClick={toggleMenu}>
        Show Menu Selected Menu: {selectedMenu}
      </Button>
      <ListGroup>
        <Trail open={showMenu} onClick={() => setShowMenu((state) => !state)}>
          {menus.map((m) => {
            return (
              <Menu
                onClickParent={onClickParent}
                key={m.slug}
                menu={m}
                showSubMenu={showSubMenu}
              />
            );
          })}
        </Trail>
      </ListGroup>
    </div>
  );
}

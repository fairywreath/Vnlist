import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

import styled from "styled-components";
import { FaCaretDown } from "react-icons/fa";
import { GiTwirlyFlower } from "react-icons/gi";
import { useClickOutside } from "../../hooks/useClickOutside";

interface Props {
  label: string;
  items: string[];
  multiSelect: boolean;
  setItems?: (args: any) => any;
  className?: string;
}

const DropdownContainerWithScrollbar = styled.div`
  position: absolute;
  background: #fcf7fb;
  color: #748899;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease-in-out;

  width: 11rem;
  padding: 8px 16px;
  font-size: 1rem;
  max-height: 24rem;

  overflow-y: hidden;
  z-index: 40;

  &:hover {
    overflow-y: overlay;
  }

  ::-webkit-scrollbar {
    width: 4.5px;
    position: absolute;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #fae1de;
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #f5d9d8;
  }
`;

const DropdownFilter = (props: Props) => {
  const [isDropdownClicked, setDropdownClicked] = useState(false);
  const [isInputFocus, setInputFocus] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [itemsList, setItemsList] = useState(props.items);

  useEffect(() => {
    setItemsList(() => {
      return props.items.filter((item) => {
        return item.toLowerCase().startsWith(search.toLowerCase());
      });
    });
  }, [search]);

  const prefix = (
    <div
      onClick={() => {
        setInputFocus(true);
      }}
      className="w-full cursor-text"
    >
      {isInputFocus ? (
        <input
          className="bg-transparent w-full h-full text-sm ml-1
    focus:outline-none"
          autoFocus
          onChange={(e) => setSearch(e.target.value)}
        />
      ) : (
        <span className="w-full cursor-pointer">
          {selectedItems.length > 0 ? (
            props.multiSelect ? (
              <>
                {selectedItems.length} item
                {selectedItems.length !== 1 ? "s" : ""}{" "}
              </>
            ) : (
              <>{selectedItems[0]}</>
            )
          ) : (
            <> Any </>
          )}
        </span>
      )}
    </div>
  );

  const icon = (
    <FaCaretDown
      size="18px"
      style={isDropdownClicked ? { transform: "rotate(-180deg)" } : {}}
    />
  );

  const wrapperRef = useRef(null);
  useClickOutside(() => {
    setDropdownClicked(false);
    setInputFocus(false);
    setSearch("");
  }, wrapperRef);

  const items = itemsList.map((item) => {
    return (
      <div
        className="p-2 rounded-md flex flex-row items-center hover:bg-accentPrimary
        justify-between w-full cursor-pointer"
        key={item}
        // some ugly callback code beause states are not reliable for this
        // should probably use useEFfect for this, will implement later
        onClick={() => {
          setInputFocus(false);
          // for real time synchoronous
          const prevItems = selectedItems;

          if (!selectedItems.includes(item)) {
            // setSearch("");
            if (props.multiSelect) {
              setSelectedItems([...selectedItems, item]);
            } else {
              setSelectedItems([item]);
            }

            if (props.setItems !== undefined) {
              // for real time
              if (props.multiSelect) {
                props.setItems([...prevItems, item]);
              } else {
                props.setItems(item);
                setDropdownClicked(false);
                setInputFocus(false);
              }
            }
          } else {
            setSelectedItems(
              selectedItems.filter((sItem) => {
                return sItem !== item;
              })
            );

            if (props.setItems !== undefined) {
              // for real time
              if (props.multiSelect) {
                props.setItems(
                  prevItems.filter((sItem) => {
                    return sItem !== item;
                  })
                );
              } else {
                props.setItems(undefined);
              }
            }
          }
        }}
      >
        {item}
        {selectedItems.includes(item) && <GiTwirlyFlower />}
      </div>
    );
  });

  return (
    <div className={`px-0 py-3 ${props.className}`}>
      <div className="text-lg text-dark mb-1">{props.label}</div>
      <div ref={wrapperRef}>
        <div
          className="bg-accentSecondary rounded-md
        flex flex-row items-center w-44 text-dark
        mb-2 px-3 py-2 shadow-md text-base"
          onClick={() => {
            setDropdownClicked(true);
          }}
        >
          <div
            className="w-full cursor-pointer flex flex-row justify-between
            items-center"
          >
            {prefix}
            {icon}
          </div>
        </div>
        {isDropdownClicked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.1 }}
          >
            <DropdownContainerWithScrollbar className="shadow-md">
              {items}
            </DropdownContainerWithScrollbar>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DropdownFilter;

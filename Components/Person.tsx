/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import type { Identifier, XYCoord } from "dnd-core";
import type { FC } from "react";
import { useRef, useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../ItemTypes";
import { useGlobalContext } from "../Context/store";
import {
  TrashIcon,
  NoSymbolIcon,
  EllipsisHorizontalCircleIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

const rowStyles =
  "flex flex-row py-4 bg-gray-50 w-full justify-between border shrink-0";
const labelStyles =
  "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2";
const tdStyles = "mx-4 flex flex-col w-full justify-center items-center";
const infoButtonStyles =
  "py-1 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white px-2 rounded";
const inputStyles =
  "py-1 appearance-none w-fit bg-gray-200 text-gray-500 border border-black-500 rounded px-1 mb-1 leading-tight focus:outline-none focus:bg-white";

export interface PersonProps {
  id: number;
  name: string;
  order: number;
  email: string;
  phoneNumber: string;
  roleId: number;
  goToId: number;
  index: number;
  status: string;
  statusIcon: number;
  setNoAdding: (boolean) => void;
  movePerson: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const Person: FC<PersonProps> = ({
  id,
  name,
  email,
  phoneNumber,
  roleId,
  index,
  movePerson,
  setNoAdding,
  goToId,
  status,
  statusIcon,
}) => {
  const { people, setPeople, setIsPosting, isPosting, setError } =
    useGlobalContext();
  const [isHovering, setIsHovering] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [order, setOrder] = useState<number>();
  const [isEditingUser, setIsEditingUser] = useState(false);
  const statusIcons = [
    "",
    <NoSymbolIcon
      key="no-symbol"
      className="pl-1 h-6 w-6 text-gray-500 grow-0 shrink-0 mr-0 ml-auto"
    />,
    <EllipsisHorizontalCircleIcon
      key="elipsis-horizontal"
      className="pl-1 h-6 w-6 text-orange-500 grow-0 shrink-0 self-end mr-0 ml-auto"
    />,
    <XCircleIcon
      key="x-circle"
      className="pl-1 h-6 w-6 text-red-500 grow-0 shrink-0 mr-0 ml-auto"
    />,
    <CheckCircleIcon
      key="check-circle"
      className="pl-1 h-6 w-6 text-green-500 shrink-0 grow-0 mr-0 ml-auto"
    />,
  ];

  let arrOfPersonnel = {};
  let currentIndex = 0;
  people.forEach((person) => {
    if (person.roleId === roleId) {
      currentIndex++;
      arrOfPersonnel[person.id] = currentIndex;
    }
  });

  function handleEditUser() {
    setIsEditingUser(true);
    setNoAdding(true);
    const personIndex = people.findIndex((i) => i.id === id);
    const currentEditee = people[personIndex];
    setNewName(String(currentEditee.name));
    setNewEmail(String(currentEditee.email));
    setNewPhoneNumber(String(currentEditee.phoneNumber));
    setOrder(Number(currentEditee.order));
  }

  async function editPerson() {
    setIsEditingUser(false);
    setNoAdding(false);
    const editedPerson = {
      name: newName,
      email: newEmail,
      order: order,
      id: id,
      phoneNumber: newPhoneNumber,
      status: status,
      statusIcon: statusIcon,
      roleId: roleId,
      goToId: goToId,
    };
    const personIndex = people.findIndex((i) => i.id === id);
    const updatedPeople = [...people];
    updatedPeople[personIndex] = editedPerson;
    setIsPosting(true);
    setPeople(updatedPeople);
    let res;
    try {
      res = await fetch(`/api/editPerson`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          editedPerson,
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      const resPerson = await res.json();
      const resPeople = [...people];
      resPeople[personIndex] = resPerson;
      setPeople(resPeople);
      setIsPosting(false);
      setNewName("");
      setNewEmail("");
      setNewPhoneNumber("");
      setOrder(null);
    }
  }

  async function deletePerson() {
    let updatedPeople = [...people];
    updatedPeople = updatedPeople.filter((i) => i.id !== id);
    setPeople(updatedPeople);
    setIsPosting(true);
    let res;
    try {
      res = await fetch(`/api/deletePerson`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });
    } catch (e) {
      console.error(e);
      setIsPosting(false);
      setError(true);
    } finally {
      setIsPosting(false);
    }
  }

  async function updateOrder() {
    setIsPosting(true);
    let res;
    try {
      res = await fetch(`/api/reorderPeople`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          people: people,
          roleId: roleId,
        }),
      });
    } catch (e) {
      console.error(e);
      setIsPosting(false);
      setError(true);
    } finally {
      const resPeople = await res.json();
      setPeople(resPeople);
      setIsPosting(false);
    }
  }

  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.PERSON,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      movePerson(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },

    drop() {
      updateOrder();
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PERSON,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div
      ref={ref}
      style={{ opacity }}
      className="relative hover:cursor-pointer flex flex-row py-4 bg-gray-50 w-full justify-between border shrink-0"
      data-handler-id={handlerId}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="ml-12 mx-4 flex flex-col w-full justify-center items-center">
        <label className={labelStyles}>Name</label>
        <div className="font-bold absolute left-2 bottom-4">
          {arrOfPersonnel[id]}
        </div>
        {isEditingUser ? (
          <input
            value={newName === "" ? name : newName}
            onChange={(e) => setNewName(e.target.value)}
            className={inputStyles}
          ></input>
        ) : (
          <div>{name}</div>
        )}
      </div>
      <div className={tdStyles}>
        <label className={labelStyles}>Email</label>
        {isEditingUser ? (
          <input
            value={newEmail === "" ? email : newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className={inputStyles}
          ></input>
        ) : (
          <div>{email}</div>
        )}
      </div>
      <div className={tdStyles}>
        <label className={labelStyles}>Phone #</label>
        {isEditingUser ? (
          <input
            value={newPhoneNumber === "" ? phoneNumber : newPhoneNumber}
            onChange={(e) => setNewPhoneNumber(e.target.value)}
            className={inputStyles}
          ></input>
        ) : (
          <div>{phoneNumber}</div>
        )}
      </div>
      <div className={tdStyles}>
        {isEditingUser ? (
          <button className={infoButtonStyles} onClick={() => editPerson()}>
            Save
          </button>
        ) : isHovering ? (
          <div className="flex items-center justfy-content mr-24">
            <button
              onClick={() => handleEditUser()}
              className="font-medium text-blue-600 dark:text-blue-500 hover:underline disabled:cursor-not-allowed"
            >
              Edit
            </button>
            <TrashIcon
              onClick={() => deletePerson()}
              className="h-5 w-5 mx-6 hover:text-red-700 text-red-500"
            />
          </div>
        ) : null}
        {status && statusIcon ? (
          <div
            style={{ width: "7rem" }}
            className="absolute right-2 flex flex-row items-center justify-around"
          >
            <div className="uppercase tracking-wide text-gray-700 text-xs w-12 grow-0">
              {status}
            </div>
            {statusIcons[statusIcon]}
          </div>
        ) : null}
      </div>
    </div>
  );
};

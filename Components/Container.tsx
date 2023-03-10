/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import update from "immutability-helper";
import { Person } from "./Person";
import { useGlobalContext } from "../Context/store";

export interface PersonInterface {
  name: string;
  order: number;
  id: number;
  email: string;
  phoneNumber: string;
  roleId: number;
  status: string;
  statusIcon: number;
  goToId: number;
}

export interface ContainerState {
  people: PersonInterface[];
}

interface Props {
  roleId: number;
  setNoAdding: (boolean) => void;
  goToId: number;
}

export const Container: React.FC<Props> = ({ roleId, goToId, setNoAdding }) => {
  const { people, setPeople, setIsPosting } = useGlobalContext();

  const movePerson = useCallback((dragIndex: number, hoverIndex: number) => {
    setPeople((prevPeople: PersonInterface[]) =>
      update(prevPeople, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevPeople[dragIndex] as PersonInterface],
        ],
      })
    );
  }, []);

  const renderPerson = useCallback(
    (
      person: {
        id: number;
        name: string;
        order: number;
        email: string;
        phoneNumber: string;
        status: string;
        statusIcon: number;
        roleId: number;
        goToId: number;
      },
      index: number
    ) => {
      if (person.roleId === roleId) {
        return (
          <Person
            key={person.id}
            order={person.order}
            email={person.email}
            phoneNumber={person.phoneNumber}
            roleId={person.roleId}
            index={index}
            id={person.id}
            name={person.name}
            movePerson={movePerson}
            setNoAdding={setNoAdding}
            status={person.status}
            statusIcon={person.statusIcon}
            goToId={goToId}
          />
        );
      }
    },
    []
  );

  return <>{people?.map((person, index) => renderPerson(person, index))}</>;
};

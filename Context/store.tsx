"use client";
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

interface DbUser {
  email: string;
  name: string;
  id: number;
}

interface Project {
  name: string;
  id: number;
  owner: {
    id: number;
  };
  startDate: Date;
  endDate: Date;
  logLine: string;
  dayDetails: {
    startTime: Date;
    endTime: Date;
    location: string;
  }[];
}

interface GoTo {
  name: String;
  id: Number;
  icon: Number;
  defaultGoTo: Boolean;
  roles: Role[];
  projectId: Number;
}

interface Role {
  name: String;
  id: Number;
  goToId: Number;
}

interface Person {
  name: string;
  order: number;
  id: number;
  email: string;
  phoneNumber: string;
  status: string;
  statusIcon: number;
  roleId: number;
  goToId: number;
}

interface ContextProps {
  dbUser: DbUser;
  setDbUser: Dispatch<SetStateAction<DbUser>>;
  project: Project;
  setProject: Dispatch<SetStateAction<Project>>;
  goTos: GoTo[];
  setGoTos: Dispatch<SetStateAction<GoTo[]>>;
  roles: Role[];
  setRoles: Dispatch<SetStateAction<Role[]>>;
  people: Person[];
  setPeople: Dispatch<SetStateAction<Person[]>>;
  noEditing: boolean;
  setNoEditing: Dispatch<SetStateAction<boolean>>;
  isPosting: boolean;
  setIsPosting: Dispatch<SetStateAction<boolean>>;
}

const GlobalContext = createContext<ContextProps>({
  dbUser: { name: "", email: "", id: 0 },
  setDbUser: () => {},
  project: {
    name: "",
    id: 0,
    owner: {
      id: 0,
    },
    startDate: new Date(),
    endDate: new Date(),
    logLine: "",
    dayDetails: [
      {
        startTime: new Date(),
        endTime: new Date(),
        location: "",
      },
    ],
  },
  setProject: () => {},
  goTos: [],
  setGoTos: () => {},
  roles: [],
  setRoles: () => {},
  people: [],
  setPeople: () => {},
  noEditing: false,
  setNoEditing: () => {},
  isPosting: false,
  setIsPosting: () => {},
});

export const GlobalContextProvider = ({ children }) => {
  const [dbUser, setDbUser] = useState<DbUser>({ name: "", email: "", id: 0 });
  const [project, setProject] = useState<Project>({
    name: "",
    id: 0,
    owner: {
      id: 0,
    },
    startDate: new Date(),
    endDate: new Date(),
    logLine: "",
    dayDetails: [
      {
        startTime: new Date(),
        endTime: new Date(),
        location: "",
      },
    ],
  });
  const [goTos, setGoTos] = useState<GoTo[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [noEditing, setNoEditing] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  return (
    <GlobalContext.Provider
      value={{
        dbUser,
        setDbUser,
        project,
        setProject,
        goTos,
        setGoTos,
        roles,
        setRoles,
        people,
        setPeople,
        noEditing,
        setNoEditing,
        isPosting,
        setIsPosting,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);

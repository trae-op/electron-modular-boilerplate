export type TEventButton = React.MouseEvent<HTMLButtonElement>;

export type THookControl = {
  handleProvider: (event: TEventButton) => void;
  handleLogout: () => void;
};

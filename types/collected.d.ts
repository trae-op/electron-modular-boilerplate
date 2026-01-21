interface Window {
  electron: {
    receive: TReceive;
    send: TSend;
    invoke: TInvoke;
  };
}

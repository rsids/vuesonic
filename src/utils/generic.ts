const noop = () => {
  /*empty by design*/
};

const duration = time => {
  const hrs = ~~(time / 3600);
  let mins = (~~((time % 3600) / 60)).toString(10);
  let secs = (~~time % 60).toString(10);
  mins = ("0" + mins).substr(-2);
  secs = ("0" + secs).substr(-2);
  let result = `${mins}:${secs}`;
  if (hrs > 0) {
    result = `${hrs}:${result}`;
  }
  return result;
};

const salt = () => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 20; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export { noop, duration, salt };

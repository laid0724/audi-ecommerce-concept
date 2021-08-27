/*
  i am not installing @types/lodash because its function names
  overlaps with RxJs, such as tap, map, etc, which messes up my
  intellisense and making it annoying as fuck to import the correct one.
*/
declare module 'lodash';

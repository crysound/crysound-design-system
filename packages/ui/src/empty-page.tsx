"use client";
import {EmptyState,type EmptyStateProps} from './empty-state';
import {CrysoundMark} from './brand-mark';

/** @deprecated Use EmptyStateProps; EmptyPage is an import-compatible alias. */
export type EmptyPageProps = EmptyStateProps;

/** @deprecated Use EmptyState with layout="page". */
export function EmptyPage({layout='page',icon,...props}:EmptyPageProps){
  return <EmptyState {...props} layout={layout} icon={icon===undefined?<CrysoundMark/>:icon}/>;
}

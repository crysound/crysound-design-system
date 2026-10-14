import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FileUpload } from '../packages/ui/src/index';
afterEach(cleanup);
describe('FileUpload drop and removal',()=>{
  it('rejects an incorrect dropped type and allows removal of accepted files',()=>{
    const change=vi.fn();const {container}=render(<FileUpload label="附件" accept=".csv" multiple onFilesChange={change} />);
    const zone=container.querySelector('.cs-upload-dropzone')!;
    fireEvent.drop(zone,{dataTransfer:{files:[new File(['x'],'bad.exe')]}});
    expect(screen.getByRole('alert')).toHaveTextContent('不支持的文件类型');expect(change).not.toHaveBeenCalled();
    const file=new File(['a,b'],'data.csv',{type:'text/csv'});fireEvent.drop(zone,{dataTransfer:{files:[file]}});
    expect(change).toHaveBeenLastCalledWith([file]);fireEvent.click(screen.getByRole('button',{name:'移除 data.csv'}));expect(change).toHaveBeenLastCalledWith([]);
  });
  it('limits file count and ignores drops while disabled',()=>{
    const change=vi.fn();const view=render(<FileUpload label="附件" multiple maxFiles={1} onFilesChange={change} />);
    fireEvent.drop(view.container.querySelector('.cs-upload-dropzone')!,{dataTransfer:{files:[new File(['a'],'a.txt'),new File(['b'],'b.txt')]}});
    expect(screen.getByRole('alert')).toHaveTextContent('最多选择 1');expect(change).not.toHaveBeenCalled();
    view.rerender(<FileUpload label="附件" disabled onFilesChange={change} />);
    fireEvent.drop(view.container.querySelector('.cs-upload-dropzone')!,{dataTransfer:{files:[new File(['a'],'a.txt')]}});expect(change).not.toHaveBeenCalled();
  });
});

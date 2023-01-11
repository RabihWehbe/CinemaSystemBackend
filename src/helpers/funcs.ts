

export function filePath(file : any){
    const filesplit = file.split('5200',2); 
    const filepath = "src" + filesplit[1];
    return filepath;
}
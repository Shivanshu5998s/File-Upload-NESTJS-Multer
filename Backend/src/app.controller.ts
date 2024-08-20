import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as path from 'path';

interface FileParams {
  fileName: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        // Same file
        destination: './uploads',
        filename: (req, file, cb) => {
          // cb - combine para, cb is a callback function that accepts 2 parameters., The most basic usage of cb consists of passing in your own function reference.,
          // https://stackoverflow.com/questions/55925522/what-is-cb-in-multer
          cb(null, `${file.originalname}`);
          // cb(`${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: any) {
    console.log(file);
    return 'success';
  }

  //  To Serve File
  @Get('/getFile')
  getFile(@Res() res: Response, @Body() file: FileParams) {
    res.sendFile(path.join(__dirname, '../uploads/' + file.fileName));
  }
}
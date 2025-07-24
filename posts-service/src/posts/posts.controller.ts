import {
    Controller,
    Get,
    Post as HttpPost,
    Put,
    Delete,
    Param,
    Body,
    Req,
} from '@nestjs/common'
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {}

    @HttpPost()
    create(@Body() body, @Req() req) {
        return this.postsService.create(body.title, body.content, req.session.userId)
    }

    @Get()
    findAll() {
        return this.postsService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postsService.findOne(id)
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body, @Req() req) {
        return this.postsService.update(id, body, req.session.userId)
    }

    @Delete(':id')
    delete(@Param('id') id: string, @Req() req) {
        return this.postsService.delete(id, req.session.userId)
    }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { EmptyResponseDTO, ResponseWithIdDTO } from 'common';
import { Auth, Paging, PagingDTO, RequestApi, ResponseApi } from 'kyoongdev-nestjs';
import { JwtAuthGuard, ReqUser, ResponseWithIdInterceptor, Role, RoleInterceptorAPI } from 'utils';

import { CreateUserDTO, UpdateUserDTO, UserDTO } from './dto';
import { UserService } from './user.service';

@ApiTags('유저')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({
    summary: '[서비스] 나의 정보 불러오기',
    description: '나의 정보를 불러옵니다.',
  })
  @Auth(JwtAuthGuard)
  @UseInterceptors(RoleInterceptorAPI(Role.USER))
  @RequestApi({})
  @ResponseApi({
    type: UserDTO,
  })
  async findMe(@ReqUser() user: User) {
    const me = await this.userService.findUser(user.id);
    return new UserDTO(me);
  }

  @Get(':id/detail')
  @ApiOperation({
    summary: '[CMS] 유저 자세히 불러오기',
    description: '유저의 자세한 정보를 불러옵니다.',
  })
  @Auth(JwtAuthGuard)
  @UseInterceptors(RoleInterceptorAPI(Role.ADMIN))
  @RequestApi({
    params: {
      name: 'id',
      type: 'string',
      required: true,
    },
  })
  @ResponseApi({
    type: UserDTO,
  })
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findUser(id);
    return new UserDTO(user);
  }

  @Get()
  @ApiOperation({
    summary: '[CMS] 유저 목록 불러오기',
    description: '유저의 목록 정보를 불러옵니다.',
  })
  @Auth(JwtAuthGuard)
  @UseInterceptors(RoleInterceptorAPI(Role.ADMIN))
  @RequestApi({
    query: {
      type: PagingDTO,
    },
  })
  @ResponseApi({
    type: UserDTO,
    isPaging: true,
  })
  async findUsers(@Paging() paging: PagingDTO) {
    return await this.userService.findUsers(paging);
  }

  @Post()
  @ApiOperation({
    summary: '[CMS] 유저 생성하기',
    description: '유저를 생성합니다.',
  })
  @Auth(JwtAuthGuard)
  @UseInterceptors(ResponseWithIdInterceptor, RoleInterceptorAPI(Role.ADMIN))
  @RequestApi({
    body: {
      type: CreateUserDTO,
    },
  })
  @ResponseApi(
    {
      type: ResponseWithIdDTO,
    },
    201
  )
  async createUser(@Body() body: CreateUserDTO) {
    return await this.userService.createUser(body);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '[CMS] 유저 수정하기',
    description: '유저를 수정합니다.',
  })
  @Auth(JwtAuthGuard)
  @UseInterceptors(RoleInterceptorAPI(Role.ADMIN))
  @RequestApi({
    params: {
      name: 'id',
      type: 'string',
      required: true,
    },
    body: {
      type: UpdateUserDTO,
    },
  })
  @ResponseApi(
    {
      type: EmptyResponseDTO,
    },
    204
  )
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    await this.userService.updateUser(id, body);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '[CMS] 유저 삭제하기',
    description: '유저를 삭제합니다.',
  })
  @Auth(JwtAuthGuard)
  @UseInterceptors(RoleInterceptorAPI(Role.ADMIN))
  @RequestApi({
    params: {
      name: 'id',
      type: 'string',
      required: true,
    },
  })
  @ResponseApi(
    {
      type: EmptyResponseDTO,
    },
    204
  )
  async deleteUser(@Param('id') id: string) {
    await this.userService.deleteUser(id);
  }
}

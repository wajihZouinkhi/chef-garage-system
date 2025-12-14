import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StaffService } from './staff.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('staff')
export class StaffController {
    constructor(private readonly staffService: StaffService) { }

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createStaffDto: any) {
        return this.staffService.create(createStaffDto);
    }

    @UseGuards(AuthGuard)
    @Get()
    findAll() {
        return this.staffService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.staffService.findOne(id);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateStaffDto: any) {
        return this.staffService.update(id, updateStaffDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.staffService.remove(id);
    }
}

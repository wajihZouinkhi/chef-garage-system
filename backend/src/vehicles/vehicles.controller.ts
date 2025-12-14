import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('vehicles')
export class VehiclesController {
    constructor(private readonly vehiclesService: VehiclesService) { }

    @UseGuards(AuthGuard)
    @Post()
    create(@Body() createVehicleDto: any) {
        // In a real app, check if user is admin here
        return this.vehiclesService.create(createVehicleDto);
    }

    @UseGuards(AuthGuard)
    @Get()
    findAll() {
        return this.vehiclesService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.vehiclesService.findOne(id);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateVehicleDto: any) {
        return this.vehiclesService.update(id, updateVehicleDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.vehiclesService.remove(id);
    }
}

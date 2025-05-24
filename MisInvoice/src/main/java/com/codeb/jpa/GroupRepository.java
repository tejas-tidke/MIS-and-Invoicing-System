package com.codeb.jpa;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codeb.entity.Group;

public interface GroupRepository extends JpaRepository<Group, Long> {
	Optional<Group> findByName(String name);
	List<Group> findByIsActive(boolean isActive);

}